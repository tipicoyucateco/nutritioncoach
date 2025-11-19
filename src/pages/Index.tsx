import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Plus, Trash2, Calculator } from "lucide-react";
import { toast } from "sonner";

interface FoodItem {
  id: string;
  quantity: string;
  unit: "piezas" | "gramos";
  name: string;
}

interface Meal {
  breakfast: FoodItem[];
  lunch: FoodItem[];
  dinner: FoodItem[];
  snacks: FoodItem[];
}

const Index = () => {
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [goal, setGoal] = useState("");
  const [activityLevel, setActivityLevel] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");

  const [meals, setMeals] = useState<Meal>({
    breakfast: [{ id: "1", quantity: "", unit: "piezas", name: "" }],
    lunch: [{ id: "2", quantity: "", unit: "gramos", name: "" }],
    dinner: [{ id: "3", quantity: "", unit: "gramos", name: "" }],
    snacks: [{ id: "4", quantity: "", unit: "piezas", name: "" }],
  });

  const addFoodItem = (mealType: keyof Meal) => {
    setMeals({
      ...meals,
      [mealType]: [
        ...meals[mealType],
        { id: Date.now().toString(), quantity: "", unit: "gramos", name: "" },
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
      .filter((item) => item.name.trim())
      .map((item) => `${item.quantity} ${item.unit} de ${item.name}`)
      .join(" + ");
  };

  const generatePrompt = () => {
    if (!gender || !age || !weight || !height || !goal || !activityLevel) {
      toast.error("Por favor completa todos los datos personales");
      return;
    }

    const breakfastText = formatMealText(meals.breakfast);
    const lunchText = formatMealText(meals.lunch);
    const dinnerText = formatMealText(meals.dinner);
    const snacksText = formatMealText(meals.snacks);

    const prompt = `Quiero que calcules mi consumo proteico y calórico diario con base en estos datos:

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
- Indica si estoy dentro del rango ideal según mi peso y objetivo.`;

    setGeneratedPrompt(prompt);
    toast.success("Prompt generado con éxito");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt);
    toast.success("Prompt copiado al portapapeles");
  };

  const renderFoodItems = (mealType: keyof Meal, mealLabel: string) => (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{mealLabel}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {meals[mealType].map((item, index) => (
          <div key={item.id} className="flex gap-2 items-end">
            <div className="flex-1 space-y-1">
              <Label htmlFor={`${mealType}-quantity-${index}`} className="text-xs">
                Cantidad
              </Label>
              <Input
                id={`${mealType}-quantity-${index}`}
                type="number"
                placeholder="Ej: 2"
                value={item.quantity}
                onChange={(e) =>
                  updateFoodItem(mealType, item.id, "quantity", e.target.value)
                }
                className="h-10"
              />
            </div>
            <div className="w-28 space-y-1">
              <Label htmlFor={`${mealType}-unit-${index}`} className="text-xs">
                Unidad
              </Label>
              <Select
                value={item.unit}
                onValueChange={(value) =>
                  updateFoodItem(mealType, item.id, "unit", value as "piezas" | "gramos")
                }
              >
                <SelectTrigger id={`${mealType}-unit-${index}`} className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="piezas">piezas</SelectItem>
                  <SelectItem value="gramos">gramos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 space-y-1">
              <Label htmlFor={`${mealType}-name-${index}`} className="text-xs">
                Alimento
              </Label>
              <Input
                id={`${mealType}-name-${index}`}
                placeholder="Ej: huevo"
                value={item.name}
                onChange={(e) =>
                  updateFoodItem(mealType, item.id, "name", e.target.value)
                }
                className="h-10"
              />
            </div>
            {meals[mealType].length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFoodItem(mealType, item.id)}
                className="h-10 w-10 shrink-0"
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
          className="w-full mt-2"
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar alimento
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <div className="container max-w-2xl mx-auto px-4 py-6 sm:py-8">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Calculator className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Calculadora Nutricional
          </h1>
          <p className="text-muted-foreground">
            Calcula tu consumo proteico y calórico diario
          </p>
        </div>

        <div className="space-y-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Datos Personales</CardTitle>
              <CardDescription>Información básica para el cálculo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gender">Sexo</Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hombre">Hombre</SelectItem>
                      <SelectItem value="mujer">Mujer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Edad (años)</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Ej: 39"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Peso (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="Ej: 74"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Altura (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="Ej: 160"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal">Objetivo</Label>
                <Select value={goal} onValueChange={setGoal}>
                  <SelectTrigger id="goal">
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
                <Label htmlFor="activity">Nivel de actividad física</Label>
                <Select value={activityLevel} onValueChange={setActivityLevel}>
                  <SelectTrigger id="activity">
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

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Comidas del Día</h2>
            {renderFoodItems("breakfast", "Desayuno")}
            {renderFoodItems("lunch", "Almuerzo")}
            {renderFoodItems("dinner", "Cena")}
            {renderFoodItems("snacks", "Snacks/Colaciones")}
          </div>

          <Button
            onClick={generatePrompt}
            className="w-full h-12 text-lg font-semibold"
            size="lg"
          >
            <Calculator className="mr-2 h-5 w-5" />
            Generar Prompt
          </Button>

          {generatedPrompt && (
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Prompt Generado
                  <Button onClick={copyToClipboard} variant="outline" size="sm">
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={generatedPrompt}
                  readOnly
                  className="min-h-[300px] font-mono text-sm"
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
