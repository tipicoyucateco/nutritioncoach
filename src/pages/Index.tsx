import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Calculator, Loader2, TrendingUp, Target, Zap, CheckCircle2, AlertCircle, Info, Instagram, Heart, FileDown } from "lucide-react";
import { toast } from "sonner";

interface FoodItem {
  id: string;
  quantity: string;
  unit: "gramos" | "mililitros" | "piezas";
  name: string;
}

interface Meal {
  breakfast: FoodItem[];
  lunch: FoodItem[];
  dinner: FoodItem[];
  snacks: FoodItem[];
}

// Componente principal de Coachito.IA
const AI_MODEL = "llama-3.3-70b-versatile"; // Modelo de IA utilizado

const Index = () => {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [goal, setGoal] = useState("");
  const [activityLevel, setActivityLevel] = useState("");
  const [analysisResult, setAnalysisResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successCount, setSuccessCount] = useState(0);

  const [meals, setMeals] = useState<Meal>({
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
  });

  // Cargar contador desde localStorage al iniciar
  useEffect(() => {
    const savedCount = localStorage.getItem("coachito_success_count");
    if (savedCount) {
      setSuccessCount(parseInt(savedCount, 10));
    }
  }, []);

  const addFoodItem = (mealType: keyof Meal) => {
    setMeals({
      ...meals,
      [mealType]: [
        ...meals[mealType],
        { id: Date.now().toString(), quantity: "", unit: "gramos" as const, name: "" },
      ],
    });
  };

  const removeFoodItem = (mealType: keyof Meal, id: string) => {
    setMeals({
      ...meals,
      [mealType]: meals[mealType].filter((item) => item.id !== id),
    });
  };

  const updateFoodItem = (
    mealType: keyof Meal,
    id: string,
    field: keyof FoodItem,
    value: string
  ) => {
    setMeals({
      ...meals,
      [mealType]: meals[mealType].map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    });
  };

  const formatMealText = (items: FoodItem[]) => {
    return items
      .filter((item) => item.name.trim() && item.quantity.trim())
      .map((item) => `${item.quantity} ${item.unit} de ${item.name}`)
      .join(" + ");
  };

  const cleanMarkdown = (text: string): string => {
    // Eliminar negritas **texto** o __texto__
    text = text.replace(/\*\*(.*?)\*\*/g, '$1');
    text = text.replace(/__(.*?)__/g, '$1');
    
    // Eliminar cursivas *texto* o _texto_
    text = text.replace(/\*(.*?)\*/g, '$1');
    text = text.replace(/_(.*?)_/g, '$1');
    
    // Eliminar encabezados markdown
    text = text.replace(/^#{1,6}\s+/gm, '');
    
    // Eliminar código inline `texto`
    text = text.replace(/`(.*?)`/g, '$1');
    
    // Eliminar enlaces [texto](url)
    text = text.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
    
    return text.trim();
  };

  const exportToPDF = async () => {
    if (!analysisResult) {
      toast.error("No hay análisis para exportar");
      return;
    }

    try {
      toast.loading("Generando PDF...", { id: "pdf-export" });
      
      // Importaciones dinámicas para evitar problemas con Vite
      const [{ default: jsPDF }] = await Promise.all([
        import("jspdf")
      ]);
      
      // Colores del sitio (HSL a RGB)
      // Primary: hsl(158 64% 52%) = rgb(45, 212, 191) = #2dd4bf
      // Foreground: hsl(155 30% 15%) = rgb(30, 58, 47) = #1e3a2f
      // Secondary: hsl(155 15% 95%) = rgb(242, 245, 244) = #f2f5f4
      // Muted: hsl(155 15% 96%) = rgb(245, 247, 246) = #f5f7f6
      const primaryColor = [45, 212, 191];
      const primaryDark = [31, 184, 163];
      const foregroundColor = [30, 58, 47];
      const secondaryColor = [242, 245, 244];
      const mutedColor = [245, 247, 246];
      const borderColor = [209, 213, 219];
      const textMuted = [107, 114, 128];
      
      // Crear PDF
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 25;
      const topMargin = 15; // Margen superior para páginas siguientes
      let yPos = margin;
      let isFirstPage = true;
      
      // Función para verificar si necesitamos nueva página
      const checkPageBreak = (requiredHeight: number) => {
        const availableHeight = isFirstPage ? pageHeight - yPos : pageHeight - topMargin - yPos;
        if (requiredHeight > availableHeight) {
          pdf.addPage();
          yPos = topMargin;
          isFirstPage = false;
        }
      };
      
      // Función para agregar texto con saltos de línea automáticos y justificación
      const addText = (text: string, x: number, y: number, maxWidth: number, fontSize: number, color: number[], isBold: boolean = false, align: "left" | "center" | "right" | "justify" = "justify") => {
        pdf.setFontSize(fontSize);
        pdf.setTextColor(color[0], color[1], color[2]);
        if (isBold) {
          pdf.setFont("helvetica", "bold");
        } else {
          pdf.setFont("helvetica", "normal");
        }
        
        const lines = pdf.splitTextToSize(text, maxWidth);
        lines.forEach((line: string) => {
          checkPageBreak(fontSize * 0.5);
          pdf.text(line, x, yPos, { align, maxWidth });
          yPos += fontSize * 0.5;
        });
      };
      
      // Header con gradiente (simulado con rectángulo)
      pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.rect(0, 0, pageWidth, 50, "F");
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.setFont("helvetica", "bold");
      pdf.text("Análisis Nutricional Detallado", margin, 25);
      
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
      const dateStr = new Date().toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      pdf.text(`Generado el ${dateStr}`, margin, 35);
      
      yPos = 70;
      
      // Sección de datos personales
      const personalDataItems = [
        name ? { label: "Nombre", value: name } : null,
        { label: "Sexo", value: gender || "N/A" },
        { label: "Edad", value: `${age || "N/A"} años` },
        { label: "Peso", value: `${weight || "N/A"} kg` },
        { label: "Altura", value: `${height || "N/A"} cm` },
        { label: "Objetivo", value: goal || "N/A" },
        { label: "Nivel de Actividad", value: activityLevel || "N/A" },
      ].filter(Boolean);
      
      // Calcular altura del recuadro dinámicamente considerando texto multilínea
      const titleHeight = 18; // Título + espacio
      const itemsPerRow = 2;
      const rows = Math.ceil(personalDataItems.length / itemsPerRow);
      const maxWidth = 75; // Ancho máximo para cada columna
      
      // Calcular altura real de cada fila considerando texto multilínea
      pdf.setFontSize(11); // Establecer tamaño de fuente para el cálculo
      let totalRowHeights = 0;
      for (let i = 0; i < rows; i++) {
        const leftIndex = i * 2;
        const rightIndex = leftIndex + 1;
        
        let leftHeight = 12; // Altura mínima
        let rightHeight = 12;
        
        if (leftIndex < personalDataItems.length) {
          const leftValueLines = pdf.splitTextToSize(personalDataItems[leftIndex]!.value, maxWidth);
          leftHeight = Math.max(12, leftValueLines.length * 5 + 2);
        }
        
        if (rightIndex < personalDataItems.length) {
          const rightValueLines = pdf.splitTextToSize(personalDataItems[rightIndex]!.value, maxWidth);
          rightHeight = Math.max(12, rightValueLines.length * 5 + 2);
        }
        
        totalRowHeights += Math.max(leftHeight, rightHeight);
      }
      
      const padding = 20; // Padding superior e inferior
      const boxHeight = titleHeight + totalRowHeights + padding;
      
      checkPageBreak(boxHeight);
      const boxStartY = yPos;
      pdf.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      pdf.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.setLineWidth(0.5);
      // roundedRect puede no estar disponible, usar rect con esquinas redondeadas manualmente
      try {
        pdf.roundedRect(margin, boxStartY, pageWidth - 2 * margin, boxHeight, 3, 3, "FD");
      } catch (e) {
        // Fallback: usar rect normal si roundedRect no está disponible
        pdf.rect(margin, boxStartY, pageWidth - 2 * margin, boxHeight, "FD");
      }
      pdf.setLineWidth(4);
      pdf.line(margin, boxStartY, margin, boxStartY + boxHeight);
      
      yPos += 10;
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(foregroundColor[0], foregroundColor[1], foregroundColor[2]);
      pdf.text("Datos Personales", margin + 8, yPos);
      yPos += 8;
      
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      
      personalDataItems.forEach((item, index) => {
        const isLeftColumn = index % 2 === 0;
        const xPos = isLeftColumn ? margin + 8 : margin + 105;
        const maxWidth = 75; // Ancho máximo para cada columna
        
        // Si es la primera columna de una nueva fila (excepto el primer item)
        if (isLeftColumn && index > 0) {
          yPos += 8;
        }
        
        const currentY = yPos;
        
        pdf.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
        pdf.setFontSize(9);
        pdf.setFont("helvetica", "bold");
        pdf.text(item!.label.toUpperCase(), xPos, currentY);
        
        pdf.setTextColor(foregroundColor[0], foregroundColor[1], foregroundColor[2]);
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "normal");
        
        // Dividir el texto en múltiples líneas si es necesario
        const valueLines = pdf.splitTextToSize(item!.value, maxWidth);
        valueLines.forEach((line: string, lineIndex: number) => {
          pdf.text(line, xPos, currentY + 5 + (lineIndex * 5));
        });
        
        // Si es la segunda columna (derecha), calcular la altura máxima de ambas columnas
        if (!isLeftColumn) {
          // Obtener el item anterior (columna izquierda)
          const prevItem = personalDataItems[index - 1];
          const prevValueLines = pdf.splitTextToSize(prevItem!.value, maxWidth);
          const prevHeight = prevValueLines.length * 5;
          const currentHeight = valueLines.length * 5;
          const maxHeight = Math.max(prevHeight, currentHeight);
          yPos += Math.max(12, maxHeight + 2);
        } else if (index === personalDataItems.length - 1) {
          // Si es el último item y está en la columna izquierda
          const currentHeight = valueLines.length * 5;
          yPos += Math.max(12, currentHeight + 2);
        }
      });
      
      yPos += 20;
      
      // Sección de análisis
      checkPageBreak(25);
      
      // Título de sección con estilo del header del sitio
      pdf.setFontSize(20);
      pdf.setFont("helvetica", "bold");
      // Gradiente simulado (from-primary to-accent)
      pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.text("Análisis Nutricional Detallado", margin, yPos);
      yPos += 8;
      
      // Descripción
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
      pdf.text("Resultado generado por IA con base en tus datos personales y comidas", margin, yPos);
      yPos += 10;
      
      // Línea separadora
      // Simular opacidad con color más claro (10% opacidad)
      const lightPrimaryColor = [
        Math.round(primaryColor[0] + (255 - primaryColor[0]) * 0.9),
        Math.round(primaryColor[1] + (255 - primaryColor[1]) * 0.9),
        Math.round(primaryColor[2] + (255 - primaryColor[2]) * 0.9)
      ];
      pdf.setDrawColor(lightPrimaryColor[0], lightPrimaryColor[1], lightPrimaryColor[2]);
      pdf.setLineWidth(0.5);
      pdf.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 12;
      
      // Agregar análisis con formato - replicando exactamente los estilos del sitio
      const analysisLines = cleanMarkdown(analysisResult).split('\n');
      
      let i = 0;
      while (i < analysisLines.length) {
        const line = analysisLines[i];
        const trimmedLine = line.trim();
        
        if (!trimmedLine) {
          yPos += 5;
          i++;
          continue;
        }
        
        // Detectar títulos de comidas (Desayuno, Almuerzo, Cena, Snacks/Colaciones)
        const isMealTitle = /^(Desayuno|Almuerzo|Cena|Snacks\/Colaciones|Snacks|Colaciones)$/i.test(trimmedLine);
        
        // Usar la misma lógica de detección que el sitio
        const hasMarkdownTitle = /^\*\*.*\*\*$/.test(line.trim()) || /^__.*__$/.test(line.trim());
        const isNumberedTitle = /^\d+[\.\)]\s/.test(trimmedLine);
        const isAllCapsTitle = /^[A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑ\s]{5,}$/.test(trimmedLine.trim());
        const endsWithColon = trimmedLine.trim().endsWith(':') && trimmedLine.length < 50;
        const isCommonTitle = /^(resumen|análisis|conclusión|recomendaciones|datos personales|macronutrientes|calorías|proteína|carbohidratos|grasas|total|evaluación)/i.test(trimmedLine.trim());
        const isTitle = hasMarkdownTitle || isNumberedTitle || (isAllCapsTitle && trimmedLine.length < 60) || (endsWithColon && isCommonTitle) || (isCommonTitle && trimmedLine.length < 50);
        
        // Detectar listas
        const isListItem = /^[-•*]\s/.test(trimmedLine) || /^\d+[\.\)]\s/.test(trimmedLine);
        
        // Detectar líneas de información nutricional detallada (formato: + Proteína: X gramos)
        const isNutritionalDetail = /^[+\-•*]\s*(Proteína|Calorías|Carbohidratos|Grasas):/i.test(trimmedLine);
        
        // Agrupar líneas nutricionales consecutivas
        if (isNutritionalDetail) {
          const nutritionalGroup: string[] = [];
          let j = i;
          while (j < analysisLines.length) {
            const nextLine = analysisLines[j].trim();
            if (/^[+\-•*]\s*(Proteína|Calorías|Carbohidratos|Grasas):/i.test(nextLine)) {
              const compact = nextLine
                .replace(/^[+\-•*]\s*/, '')
                .replace(/\s*\([^)]+\)/g, '');
              nutritionalGroup.push(compact);
              j++;
            } else {
              break;
            }
          }
          
          // Formato compacto: unir todas las líneas nutricionales con " • "
          const compactText = nutritionalGroup.join(' • ');
          checkPageBreak(8);
          yPos += 1;
          
          pdf.setFontSize(10);
          pdf.setFont("helvetica", "normal");
          pdf.setTextColor(foregroundColor[0], foregroundColor[1], foregroundColor[2]);
          const compactLines = pdf.splitTextToSize(compactText, pageWidth - 2 * margin);
          compactLines.forEach((line: string) => {
            checkPageBreak(5);
            pdf.text(line, margin, yPos);
            yPos += 5;
          });
          
          i = j;
          continue;
        }
        
        // Detectar líneas importantes (con palabras clave pero que no son títulos)
        const isImportant = /(total|calorías|proteína|carbohidratos|grasas|recomendación|ideal|rango)/i.test(trimmedLine) && !isTitle && !isNutritionalDetail;
        
        if (isMealTitle && trimmedLine) {
          // Título de comida con estilo vistoso en PDF (sin fondo)
          checkPageBreak(20);
          yPos += 10;
          
          // Texto con gradiente simulado (usar color primario, más grande y centrado)
          pdf.setFontSize(22);
          pdf.setFont("helvetica", "bold");
          pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
          pdf.text(trimmedLine, pageWidth / 2, yPos, { align: "center" });
          
          yPos += 12;
        } else if (isTitle && trimmedLine) {
          // Título: text-lg font-bold text-primary mt-6 mb-3 con punto decorativo
          // text-lg = 18px = 4.76mm, mt-6 = 24px = 6.35mm, mb-3 = 12px = 3.17mm
          checkPageBreak(28);
          if (i > 0) yPos += 6.5; // mt-6 equivalente
          
          // Punto decorativo (h-1 w-1 rounded-full bg-primary) - 4px = 1mm
          pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
          try {
            pdf.circle(margin + 2, yPos - 0.5, 0.75, "F");
          } catch (e) {
            // Fallback: usar ellipse si circle no está disponible
            pdf.ellipse(margin + 2, yPos - 0.5, 0.75, 0.75, "F");
          }
          
          pdf.setFontSize(18); // text-lg = 18px
          pdf.setFont("helvetica", "bold");
          pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
          const titleText = trimmedLine.replace(/\*\*/g, '').replace(/^\d+[\.\)]\s/, '');
          const titleLines = pdf.splitTextToSize(titleText, pageWidth - 2 * margin - 8);
          titleLines.forEach((line: string) => {
            checkPageBreak(9);
            pdf.text(line, margin + 5, yPos);
            yPos += 9;
          });
          yPos += 3.5; // mb-3 equivalente
        } else if (isListItem && trimmedLine) {
          // Lista: CheckCircle2 icon con text-primary/60 y texto - my-2 pl-2
          // text-sm = 14px = 3.7mm, my-2 = 8px = 2.1mm
          checkPageBreak(12);
          yPos += 2; // my-2 equivalente
          
          // Icono CheckCircle2 (h-4 w-4 text-primary/60) - 16px = 4.2mm, 60% opacidad
          // Simular 60% de opacidad mezclando con blanco
          const iconColor60 = [
            Math.round(primaryColor[0] + (255 - primaryColor[0]) * 0.4),
            Math.round(primaryColor[1] + (255 - primaryColor[1]) * 0.4),
            Math.round(primaryColor[2] + (255 - primaryColor[2]) * 0.4)
          ];
          pdf.setFillColor(iconColor60[0], iconColor60[1], iconColor60[2]);
          try {
            pdf.circle(margin + 4, yPos - 1, 2, "F"); // h-4 w-4 = 16px = 4.2mm
          } catch (e) {
            // Fallback: usar ellipse si circle no está disponible
            pdf.ellipse(margin + 4, yPos - 1, 2, 2, "F");
          }
          
          pdf.setFontSize(14); // text-sm = 14px
          pdf.setFont("helvetica", "normal");
          pdf.setTextColor(foregroundColor[0], foregroundColor[1], foregroundColor[2]);
          const listText = trimmedLine.replace(/^[-•*]\s/, '').replace(/^\d+[\.\)]\s/, '');
          const listLines = pdf.splitTextToSize(listText, pageWidth - 2 * margin - 12);
          listLines.forEach((line: string) => {
            checkPageBreak(7);
            pdf.text(line, margin + 8, yPos, { align: "justify", maxWidth: pageWidth - 2 * margin - 12 });
            yPos += 7;
          });
          yPos += 2; // my-2 equivalente
        } else if (isNutritionalDetail && trimmedLine) {
          // Información nutricional sin fondo, formato compacto
          checkPageBreak(8);
          yPos += 1; // Espaciado mínimo
          
          // Compactar el texto: remover el símbolo inicial y paréntesis con info adicional
          const compactText = trimmedLine
            .replace(/^[+\-•*]\s*/, '')
            .replace(/\s*\([^)]+\)/g, ''); // Remover paréntesis con información adicional
          
          pdf.setFontSize(10); // Tamaño más pequeño para formato compacto
          pdf.setFont("helvetica", "normal");
          pdf.setTextColor(foregroundColor[0], foregroundColor[1], foregroundColor[2]);
          const compactLines = pdf.splitTextToSize(compactText, pageWidth - 2 * margin);
          compactLines.forEach((line: string) => {
            checkPageBreak(5);
            pdf.text(line, margin, yPos);
            yPos += 5;
          });
        } else if (isImportant && trimmedLine) {
          // Línea importante: bg-primary/10 border-l-4 border-primary rounded-r-md font-semibold my-3 px-4 py-2
          // my-3 = 12px = 3.17mm, px-4 = 16px = 4.23mm, py-2 = 8px = 2.12mm
          checkPageBreak(18);
          yPos += 3; // my-3 equivalente
          
          // Detectar si es un "Total" (desayuno, cena, snacks, etc.)
          const isTotal = /^Total\s+(desayuno|cena|almuerzo|snacks|colaciones)/i.test(trimmedLine);
          
          // Calcular dimensiones del texto primero
          pdf.setFontSize(11);
          pdf.setFont("helvetica", "bold");
          const textLines = pdf.splitTextToSize(trimmedLine, pageWidth - 2 * margin - 24);
          const textHeight = textLines.length * 6.5;
          const paddingVertical = 5; // py-2 equivalente (8px = 2mm, pero ajustado)
          const boxHeight = textHeight + (paddingVertical * 2);
          
          // Si es un "Total", centrar verticalmente el texto en el recuadro
          const boxStartY = yPos - 2.5;
          let textStartY = yPos;
          
          if (isTotal) {
            // Centrar el texto verticalmente en el recuadro
            textStartY = boxStartY + (boxHeight / 2) - (textHeight / 2) + 2;
          }
          
          // Fondo bg-primary/10 (10% opacidad)
          // Simular opacidad mezclando con blanco
          const lightBgColor = [
            Math.round(primaryColor[0] + (255 - primaryColor[0]) * 0.9),
            Math.round(primaryColor[1] + (255 - primaryColor[1]) * 0.9),
            Math.round(primaryColor[2] + (255 - primaryColor[2]) * 0.9)
          ];
          pdf.setFillColor(lightBgColor[0], lightBgColor[1], lightBgColor[2]);
          try {
            pdf.roundedRect(margin + 10, boxStartY, pageWidth - 2 * margin - 20, boxHeight, 2, 2, "F");
          } catch (e) {
            // Fallback: usar rect normal si roundedRect no está disponible
            pdf.rect(margin + 10, boxStartY, pageWidth - 2 * margin - 20, boxHeight, "F");
          }
          
          // Borde izquierdo border-l-4 border-primary (4px = 1.06mm)
          pdf.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
          pdf.setLineWidth(1.1);
          pdf.line(margin + 10, boxStartY, margin + 10, boxStartY + boxHeight);
          
          // Texto font-semibold
          pdf.setFontSize(11);
          pdf.setFont("helvetica", "bold");
          pdf.setTextColor(foregroundColor[0], foregroundColor[1], foregroundColor[2]);
          let currentTextY = textStartY;
          textLines.forEach((line: string) => {
            checkPageBreak(6.5);
            pdf.text(line, margin + 16, currentTextY, { align: "justify", maxWidth: pageWidth - 2 * margin - 26 });
            currentTextY += 6.5;
          });
          
          // Actualizar yPos basado en la altura del recuadro
          yPos = boxStartY + boxHeight + 3; // my-3 equivalente después del recuadro
        } else if (trimmedLine) {
          i++;
          // Párrafo normal: text-foreground/90 leading-relaxed my-2
          // text-sm sm:text-[15px] = 14px base, 15px en pantallas grandes
          // leading-6 = 24px = 6.35mm, leading-7 = 28px = 7.4mm
          checkPageBreak(12);
          yPos += 2; // my-2 equivalente
          
          pdf.setFontSize(14); // text-sm = 14px base
          pdf.setFont("helvetica", "normal");
          // text-foreground/90 (90% de opacidad) - font-[450] = medium weight
          const textColor = [
            Math.round(foregroundColor[0] * 0.9), 
            Math.round(foregroundColor[1] * 0.9), 
            Math.round(foregroundColor[2] * 0.9)
          ];
          pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
          
          const paraLines = pdf.splitTextToSize(trimmedLine, pageWidth - 2 * margin - 4);
          paraLines.forEach((line: string) => {
            checkPageBreak(7);
            pdf.text(line, margin + 2, yPos, { align: "justify", maxWidth: pageWidth - 2 * margin - 4 });
            yPos += 7; // leading-6 sm:leading-7 equivalente
          });
          yPos += 2; // my-2 equivalente
        }
        
        i++;
      }
      
      yPos += 15;
      
      // Footer
      checkPageBreak(15);
      pdf.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
      pdf.setLineWidth(0.5);
      pdf.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 8;
      
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
      pdf.text("Generado por Coachito.IA", pageWidth / 2, yPos, { align: "center" });
      yPos += 5;
      pdf.text("@tipicoyucateco", pageWidth / 2, yPos, { align: "center" });
      
      // Descargar
      // Formatear el nombre para el archivo (remover caracteres especiales y espacios)
      const formattedName = name 
        ? name
            .trim()
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
            .substring(0, 50) // Limitar longitud
        : 'usuario';
      const fileDate = new Date().toISOString().split("T")[0];
      const fileName = `analisis-nutricional-${formattedName}-${fileDate}.pdf`;
      pdf.save(fileName);
      
      toast.success("PDF generado exitosamente", { id: "pdf-export" });
    } catch (error) {
      console.error("Error al generar PDF:", error);
      toast.error("Error al generar el PDF", { id: "pdf-export" });
    }
  };


  const analyzeNutrition = async () => {
    if (!name || !gender || !age || !weight || !height || !goal || !activityLevel) {
      toast.error("Por favor completa todos los datos personales");
      return;
    }

    // Validar que todos los alimentos tengan cantidad y nombre
    const allMeals = [...meals.breakfast, ...meals.lunch, ...meals.dinner, ...meals.snacks];
    const incompleteItems = allMeals.filter(item => !item.quantity.trim() || !item.name.trim());
    
    if (incompleteItems.length > 0) {
      toast.error("Por favor completa la cantidad y el nombre de todos los alimentos");
      return;
    }

    // Validar que haya al menos una comida en Desayuno, Almuerzo y Cena
    const breakfastValid = meals.breakfast.filter(item => item.name.trim() && item.quantity.trim()).length > 0;
    const lunchValid = meals.lunch.filter(item => item.name.trim() && item.quantity.trim()).length > 0;
    const dinnerValid = meals.dinner.filter(item => item.name.trim() && item.quantity.trim()).length > 0;

    if (!breakfastValid) {
      toast.error("Por favor agrega al menos un alimento en Desayuno");
      return;
    }

    if (!lunchValid) {
      toast.error("Por favor agrega al menos un alimento en Almuerzo");
      return;
    }

    if (!dinnerValid) {
      toast.error("Por favor agrega al menos un alimento en Cena");
      return;
    }

    const breakfastText = formatMealText(meals.breakfast);
    const lunchText = formatMealText(meals.lunch);
    const dinnerText = formatMealText(meals.dinner);
    const snacksText = formatMealText(meals.snacks);

    const prompt = `Quiero que calcules mi consumo proteico y calórico diario con base en estos datos:

${name ? `Nombre: ${name}` : ""}
Sexo: ${gender}
Edad: ${age}
Peso: ${weight} kg
Altura: ${height} cm
Objetivo: ${goal}
Nivel de actividad: ${activityLevel}

👉 Comidas del día:
${breakfastText ? `Desayuno: ${breakfastText}` : ""}
${lunchText ? `Almuerzo: ${lunchText}` : ""}
${dinnerText ? `Cena: ${dinnerText}` : ""}
${snacksText ? `Snacks/colaciones: ${snacksText}` : ""}

Por favor:
- Calcula gramos de proteína por comida y el total diario.
- Calcula también calorías, proteína, carbohidratos y grasas totales.
- Indica si estoy dentro del rango ideal según mi peso y objetivo.
- Proporciona recomendaciones específicas basadas en mi objetivo.`;

    setIsLoading(true);
    setAnalysisResult("");

    try {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;
      
      if (!apiKey) {
        const errorMessage = import.meta.env.PROD 
          ? "API Key de Groq no configurada en GitHub Pages. Por favor, configura el secret VITE_GROQ_API_KEY en GitHub."
          : "API Key de Groq no configurada. Por favor, configura VITE_GROQ_API_KEY en el archivo .env";
        toast.error(errorMessage);
        setIsLoading(false);
        return;
      }

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: AI_MODEL,
          messages: [
            {
              role: "system",
              content: "Eres un nutricionista experto. Proporciona respuestas claras, detalladas y bien estructuradas sobre nutrición, proteínas, calorías y macronutrientes. Formatea tu respuesta de manera organizada con secciones claras.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `Error: ${response.statusText}`);
      }

      const data = await response.json();
      const assistantMessage = data.choices[0]?.message?.content;

      if (assistantMessage) {
        setAnalysisResult(assistantMessage);
        toast.success("Análisis completado con éxito");
        
        // Incrementar contador de ejecuciones exitosas
        const newCount = successCount + 1;
        setSuccessCount(newCount);
        localStorage.setItem("coachito_success_count", newCount.toString());
      } else {
        throw new Error("No se recibió respuesta de Groq");
      }
    } catch (error) {
      console.error("Error al llamar a Groq:", error);
      toast.error(
        error instanceof Error
          ? `Error: ${error.message}`
          : "Error al conectar con el servicio de análisis. Intenta nuevamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderFoodItems = (mealType: keyof Meal, mealLabel: string) => (
    <Card className="shadow-sm">
      <CardHeader className="pb-2 sm:pb-3">
        <CardTitle className="text-base sm:text-lg">{mealLabel}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 sm:space-y-3">
        {meals[mealType].map((item, index) => (
          <div key={item.id} className="flex flex-col sm:flex-row gap-2 sm:items-end">
            <div className="flex-1 space-y-1">
              <Label htmlFor={`${mealType}-quantity-${index}`} className="text-xs">
                Cantidad <span className="text-destructive">*</span>
              </Label>
              <Input
                id={`${mealType}-quantity-${index}`}
                type="number"
                placeholder="Ej: 2"
                value={item.quantity}
                onChange={(e) =>
                  updateFoodItem(mealType, item.id, "quantity", e.target.value)
                }
                className="h-11 sm:h-10 text-base"
                required
                min="0.1"
                step="0.1"
              />
            </div>
            <div className="w-full sm:w-28 space-y-1">
              <Label htmlFor={`${mealType}-unit-${index}`} className="text-xs">
                Unidad
              </Label>
              <Select
                value={item.unit}
                onValueChange={(value) =>
                  updateFoodItem(mealType, item.id, "unit", value as "gramos" | "mililitros" | "piezas")
                }
              >
                <SelectTrigger id={`${mealType}-unit-${index}`} className="h-11 sm:h-10 text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gramos">Gramos</SelectItem>
                  <SelectItem value="mililitros">Mililitros</SelectItem>
                  <SelectItem value="piezas">Piezas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 space-y-1">
              <Label htmlFor={`${mealType}-name-${index}`} className="text-xs">
                Alimento <span className="text-destructive">*</span>
              </Label>
              <Input
                id={`${mealType}-name-${index}`}
                placeholder="Ej: huevo"
                value={item.name}
                onChange={(e) =>
                  updateFoodItem(mealType, item.id, "name", e.target.value)
                }
                className="h-11 sm:h-10 text-base"
                required
              />
            </div>
            {meals[mealType].length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFoodItem(mealType, item.id)}
                className="h-11 w-11 sm:h-10 sm:w-10 shrink-0 self-end sm:self-auto touch-manipulation"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => addFoodItem(mealType)}
          className="w-full mt-2 h-10 sm:h-9 text-sm touch-manipulation"
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar alimento
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <div className="container max-w-2xl mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/10 mb-3 sm:mb-4">
            <Calculator className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent px-2">
            Coachito.IA
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground px-2">
            Evalua tu consumo de macronutrientes diarios
          </p>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <Card className="shadow-md">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-lg sm:text-xl">Datos Personales</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Información básica para el cálculo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm">Nombre <span className="text-destructive">*</span></Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Ej: Juan Pérez"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11 sm:h-10 text-base"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-sm">Sexo <span className="text-destructive">*</span></Label>
                  <Select value={gender} onValueChange={setGender} required>
                    <SelectTrigger id="gender" className="h-11 sm:h-10 text-base">
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hombre">Hombre</SelectItem>
                      <SelectItem value="mujer">Mujer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-sm">Edad (años) <span className="text-destructive">*</span></Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Ej: 39"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="h-11 sm:h-10 text-base"
                    required
                    min="1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight" className="text-sm">Peso (kg) <span className="text-destructive">*</span></Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="Ej: 74"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="h-11 sm:h-10 text-base"
                    required
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height" className="text-sm">Altura (cm) <span className="text-destructive">*</span></Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="Ej: 160"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="h-11 sm:h-10 text-base"
                    required
                    min="1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal" className="text-sm">Objetivo <span className="text-destructive">*</span></Label>
                <Select value={goal} onValueChange={setGoal} required>
                  <SelectTrigger id="goal" className="h-11 sm:h-10 text-base">
                    <SelectValue placeholder="Selecciona tu objetivo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bajar grasa">Bajar grasa</SelectItem>
                    <SelectItem value="mantener">Mantener</SelectItem>
                    <SelectItem value="ganar músculo">Ganar músculo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="activity" className="text-sm">Nivel de actividad física <span className="text-destructive">*</span></Label>
                <Select value={activityLevel} onValueChange={setActivityLevel} required>
                  <SelectTrigger id="activity" className="h-11 sm:h-10 text-base">
                    <SelectValue placeholder="Selecciona tu nivel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ejercicio nulo">Ejercicio nulo</SelectItem>
                    <SelectItem value="ejercicio bajo 1-2 veces/semana">
                      Bajo (1-2 veces/semana)
                    </SelectItem>
                    <SelectItem value="ejercicio moderado 3-4 veces/semana">
                      Moderado (3-4 veces/semana)
                    </SelectItem>
                    <SelectItem value="ejercicio intenso 5+ veces/semana">
                      Intenso (5+ veces/semana)
                    </SelectItem>
                    <SelectItem value="ejercicio intenso de pesas 5 veces/semana">
                      Intenso pesas (5 veces/semana)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-lg sm:text-xl font-semibold px-1">Comidas del Día</h2>
            {renderFoodItems("breakfast", "Desayuno")}
            {renderFoodItems("lunch", "Almuerzo")}
            {renderFoodItems("dinner", "Cena")}
            {renderFoodItems("snacks", "Snacks/Colaciones")}
          </div>

          <Button
            onClick={analyzeNutrition}
            className="w-full h-12 sm:h-11 text-base sm:text-lg font-semibold touch-manipulation"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analizando...
              </>
            ) : (
              <>
            <Calculator className="mr-2 h-5 w-5" />
                Analizar
              </>
            )}
          </Button>

          {analysisResult && (
            <Card className="shadow-xl border-2 border-primary/20 bg-gradient-to-br from-background to-primary/5 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <CardHeader className="bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 border-b border-primary/10 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-3">
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <div className="p-1.5 sm:p-2 rounded-full bg-primary/20 flex-shrink-0">
                      <Target className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent break-words">
                        Análisis Nutricional Detallado
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm mt-1 text-muted-foreground">
                        Resultado generado por IA con base en tus datos personales y comidas
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                      onClick={exportToPDF}
                      variant="outline"
                      size="sm"
                      className="flex-1 sm:flex-initial touch-manipulation"
                    >
                      <FileDown className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Exportar PDF</span>
                      <span className="sm:hidden">PDF</span>
                  </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
                <div className="space-y-4 sm:space-y-6">
                  {/* Contenido principal del análisis */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 rounded-xl blur-xl"></div>
                    <div className="relative bg-gradient-to-br from-card to-muted/30 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-xl border border-primary/10 shadow-lg overflow-hidden">
                      <div className="prose prose-slate dark:prose-invert max-w-none">
                        <div className="whitespace-pre-wrap text-sm sm:text-[15px] leading-6 sm:leading-7 text-foreground/90 font-[450] break-words overflow-wrap-anywhere">
                          {(() => {
                            const lines = analysisResult.split('\n');
                            const processedLines: JSX.Element[] = [];
                            let i = 0;
                            
                            while (i < lines.length) {
                              const line = lines[i];
                              const cleanedLine = cleanMarkdown(line);
                              
                              if (!cleanedLine) {
                                processedLines.push(<br key={i} />);
                                i++;
                                continue;
                              }
                              
                              // Detectar títulos de comidas (Desayuno, Almuerzo, Cena, Snacks/Colaciones)
                              const isMealTitle = /^(Desayuno|Almuerzo|Cena|Snacks\/Colaciones|Snacks|Colaciones)$/i.test(cleanedLine.trim());
                              
                              // Detectar títulos (líneas que empiezan con #, números, o están en mayúsculas, o tienen **alrededor)
                              const hasMarkdownTitle = /^\*\*.*\*\*$/.test(line.trim()) || /^__.*__$/.test(line.trim());
                              const isNumberedTitle = /^\d+[\.\)]\s/.test(cleanedLine);
                              const isAllCapsTitle = /^[A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑ\s]{5,}$/.test(cleanedLine.trim());
                              const endsWithColon = cleanedLine.trim().endsWith(':') && cleanedLine.length < 50;
                              // Palabras comunes que son títulos
                              const isCommonTitle = /^(resumen|análisis|conclusión|recomendaciones|datos personales|macronutrientes|calorías|proteína|carbohidratos|grasas|total|evaluación)/i.test(cleanedLine.trim());
                              const isTitle = hasMarkdownTitle || isNumberedTitle || (isAllCapsTitle && cleanedLine.length < 60) || (endsWithColon && isCommonTitle) || (isCommonTitle && cleanedLine.length < 50);
                              
                              // Detectar listas
                              const isListItem = /^[-•*]\s/.test(cleanedLine) || /^\d+[\.\)]\s/.test(cleanedLine);
                              
                              // Detectar líneas de información nutricional detallada (formato: + Proteína: X gramos)
                              const isNutritionalDetail = /^[+\-•*]\s*(Proteína|Calorías|Carbohidratos|Grasas):/i.test(cleanedLine);
                              
                              // Agrupar líneas nutricionales consecutivas
                              if (isNutritionalDetail) {
                                const nutritionalGroup: string[] = [];
                                let j = i;
                                while (j < lines.length) {
                                  const nextLine = cleanMarkdown(lines[j]);
                                  if (/^[+\-•*]\s*(Proteína|Calorías|Carbohidratos|Grasas):/i.test(nextLine)) {
                                    const compact = nextLine
                                      .replace(/^[+\-•*]\s*/, '')
                                      .replace(/\s*\([^)]+\)/g, '');
                                    nutritionalGroup.push(compact);
                                    j++;
                                  } else {
                                    break;
                                  }
                                }
                                
                                // Formato compacto: unir todas las líneas nutricionales con " • "
                                const compactText = nutritionalGroup.join(' • ');
                                processedLines.push(
                                  <p key={i} className="my-1 text-foreground/90 text-sm break-words">
                                    {compactText}
                                  </p>
                                );
                                i = j;
                                continue;
                              }
                              
                              // Detectar líneas importantes (con palabras clave pero que no son títulos)
                              const isImportant = /(total|calorías|proteína|carbohidratos|grasas|recomendación|ideal|rango)/i.test(cleanedLine) && !isTitle && !isNutritionalDetail;
                              
                              if (isMealTitle && cleanedLine) {
                                // Título de comida con estilo vistoso sin fondo
                                processedLines.push(
                                  <h3 key={i} className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent my-6 sm:my-8 text-center">
                                    {cleanedLine}
                                  </h3>
                                );
                              } else if (isTitle && cleanedLine) {
                                processedLines.push(
                                  <h3 key={i} className="text-lg font-bold text-primary mt-6 mb-3 first:mt-0 flex items-center gap-2 break-words">
                                    <div className="h-1 w-1 rounded-full bg-primary flex-shrink-0"></div>
                                    <span className="break-words">{cleanedLine.replace(/^\d+[\.\)]\s/, '')}</span>
                                  </h3>
                                );
                              } else if (isListItem && cleanedLine) {
                                processedLines.push(
                                  <div key={i} className="flex items-start gap-3 my-2 pl-2">
                                    <CheckCircle2 className="h-4 w-4 text-primary/60 mt-1 flex-shrink-0" />
                                    <span className="flex-1 break-words">{cleanedLine.replace(/^[-•*]\s/, '').replace(/^\d+[\.\)]\s/, '')}</span>
                                  </div>
                                );
                              } else if (isImportant && cleanedLine) {
                                processedLines.push(
                                  <p key={i} className="my-3 px-4 py-2 bg-primary/10 border-l-4 border-primary rounded-r-md font-semibold text-foreground break-words">
                                    {cleanedLine}
                                  </p>
                                );
                              } else if (cleanedLine) {
                                processedLines.push(
                                  <p key={i} className="my-2 text-foreground/85 leading-relaxed break-words">
                                    {cleanedLine}
                                  </p>
                                );
                              }
                              
                              i++;
                            }
                            
                            return processedLines;
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Tarjetas informativas mejoradas */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-4 border-t border-primary/10">
                    <div className="group relative overflow-hidden flex items-center gap-2.5 p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                      <div className="p-2 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors flex-shrink-0">
                        <TrendingUp className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground break-words">Análisis Completo</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Macronutrientes calculados</p>
                      </div>
                    </div>
                    <div className="group relative overflow-hidden flex items-center gap-2.5 p-4 bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl border border-accent/20 hover:border-accent/40 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                      <div className="p-2 rounded-lg bg-accent/20 group-hover:bg-accent/30 transition-colors flex-shrink-0">
                        <Target className="h-4 w-4 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground break-words">Objetivo Evaluado</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Rangos ideales verificados</p>
                      </div>
                    </div>
                    <div className="group relative overflow-hidden flex items-center gap-2.5 p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                      <div className="p-2 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors flex-shrink-0">
                        <Zap className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground break-words">Recomendaciones</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Sugerencias personalizadas</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Sección de Agradecimientos */}
          <Card className="shadow-md border border-primary/10 bg-gradient-to-br from-background to-primary/5">
            <CardContent className="pt-4 sm:pt-6 pb-4 sm:pb-6 px-4 sm:px-6">
              <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
                <div className="space-y-2 sm:space-y-3 text-sm sm:text-base text-foreground/90">
                  <p className="font-medium">Ayúdame a mejorar este sitio.</p>
                  <p>¿Tienes una idea o comentario? Mándame un DM y cuéntamelo sin pena. Tu opinión me sirve un montón.</p>
                </div>
                <a
                  href="https://www.instagram.com/tipicoyucateco/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition-all duration-300 hover:opacity-80 touch-manipulation"
                >
                  <Instagram className="h-5 w-5 sm:h-6 sm:w-6 text-foreground" />
                  <span className="text-sm sm:text-base text-foreground font-semibold">@tipicoyucateco</span>
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Contador de ejecuciones exitosas y modelo de IA */}
          <div className="mt-4 sm:mt-6 space-y-3 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span className="text-sm text-foreground/80">
                <span className="font-semibold text-primary">{successCount.toLocaleString()}</span>{" "}
                {successCount === 1 ? "análisis completado" : "análisis completados"}
              </span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted/50 border border-primary/10 rounded-lg">
              <Zap className="h-4 w-4 text-primary/70" />
              <span className="text-xs text-foreground/60">
                Powered by <span className="font-semibold text-foreground/80">{AI_MODEL}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
