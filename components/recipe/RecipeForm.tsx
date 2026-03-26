"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-hot-toast";

import { api } from "@/lib/api";
import { Recipe, Tag, Ingredient } from "@/types";
import { useTags } from "@/hooks/useTags";
import { useIngredients } from "@/hooks/useIngredients";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Combobox } from "@/components/ui/Combobox";

const recipeSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().optional(),
  time_minutes: z.number().min(1, "Time must be at least 1 minute"),
  price: z.number().min(0, "Price must be a valid number"),
  link: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  tags: z.array(z.object({ id: z.union([z.number(), z.string()]), name: z.string() })),
  ingredients: z.array(z.object({ id: z.union([z.number(), z.string()]), name: z.string() })),
});

export type RecipeFormValues = z.infer<typeof recipeSchema>;

interface RecipeFormProps {
  initialData?: Recipe;
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
}

export function RecipeForm({ initialData, onSubmit, isLoading = false }: RecipeFormProps) {
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const { tags: availableTags } = useTags();
  const { ingredients: availableIngredients } = useIngredients();

  const {
    register,
    handleSubmit,
    control,
    trigger,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      title: "",
      description: "",
      time_minutes: 30,
      price: 0,
      link: "",
      tags: [],
      ingredients: [],
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        description: initialData.description,
        time_minutes: initialData.time_minutes,
        price: parseFloat(initialData.price),
        link: initialData.link || "",
        tags: initialData.tags,
        ingredients: initialData.ingredients,
      });
    }
  }, [initialData, reset]);

  const formValues = watch();

  const handleNext = async () => {
    let isValid = false;
    if (step === 1) {
      isValid = await trigger(["title", "description", "time_minutes", "price", "link"]);
    } else if (step === 2) {
      isValid = await trigger(["tags", "ingredients"]);
    }

    if (isValid) {
      setStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  // Add a new tag locally — the recipe API creates it on save via { name: ... }
  const handleCreateTag = (name: string, onChange: (val: any) => void, currentValue: any[]) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const alreadyExists = currentValue.some(t => t.name.toLowerCase() === trimmed.toLowerCase());
    if (alreadyExists) return;
    onChange([...currentValue, { id: `new-${Date.now()}`, name: trimmed }]);
    toast.success(`Tag "${trimmed}" will be saved with the recipe`);
  };

  // Add a new ingredient locally — the recipe API creates it on save via { name: ... }
  const handleCreateIngredient = (name: string, onChange: (val: any) => void, currentValue: any[]) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const alreadyExists = currentValue.some(i => i.name.toLowerCase() === trimmed.toLowerCase());
    if (alreadyExists) return;
    onChange([...currentValue, { id: `new-${Date.now()}`, name: trimmed }]);
    toast.success(`Ingredient "${trimmed}" will be saved with the recipe`);
  };


  const handleFormSubmit = async (data: RecipeFormValues) => {
    // Format data for API
    const formattedData = {
      ...data,
      price: data.price.toFixed(2),
      tags: data.tags.map(t => typeof t.id === 'string' ? { name: t.name } : { id: t.id }),
      ingredients: data.ingredients.map(i => typeof i.id === 'string' ? { name: i.name } : { id: i.id }),
    };
    await onSubmit(formattedData);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-border/50 z-0 rounded-full" />
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary z-0 rounded-full transition-all duration-300" 
            style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
          />
          {[1, 2, 3].map((num) => (
            <div 
              key={num} 
              className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 shadow-sm
                ${step >= num ? 'bg-primary text-white border-2 border-primary' : 'bg-surface text-text-secondary border-2 border-border'}
              `}
            >
              {num}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
          <span className={step >= 1 ? "text-primary" : ""}>Basics</span>
          <span className={step >= 2 ? "text-primary" : ""}>Tags & Ingredients</span>
          <span className={step >= 3 ? "text-primary" : ""}>Review</span>
        </div>
      </div>

      <Card className="border-border/50 shadow-md">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            {/* Step 1: Basics */}
            <div className={step === 1 ? "block space-y-6" : "hidden"}>
              <h2 className="text-2xl font-bold text-text-primary mb-6">Basic Information</h2>
              
              <Input
                label="Recipe Title *"
                placeholder="E.g. Spicy Chicken Curry"
                {...register("title")}
                error={errors.title?.message}
              />
              
              <div className="w-full flex flex-col space-y-1">
                <label className="text-sm font-medium text-text-primary">Description</label>
                <textarea
                  className="w-full rounded-xl border-2 border-border bg-transparent p-3 text-sm transition-colors focus-visible:outline-none focus-visible:border-primary disabled:opacity-50 min-h-[120px] resize-y"
                  placeholder="Share a short story or description about this recipe."
                  {...register("description")}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Preparation Time (minutes) *"
                  type="number"
                  min="1"
                  {...register("time_minutes", { valueAsNumber: true })}
                  error={errors.time_minutes?.message}
                />
                
                <Input
                  label="Estimated Cost ($) *"
                  type="number"
                  step="0.01"
                  min="0"
                  {...register("price", { valueAsNumber: true })}
                  error={errors.price?.message}
                />
              </div>

              <Input
                label="Original Source Link"
                type="url"
                placeholder="https://..."
                {...register("link")}
                error={errors.link?.message}
              />
            </div>

            {/* Step 2: Tags & Ingredients */}
            <div className={step === 2 ? "block space-y-8" : "hidden"}>
              <h2 className="text-2xl font-bold text-text-primary mb-6">Categorization</h2>
              
              <div className="space-y-6">
                <Controller
                  name="tags"
                  control={control}
                  render={({ field }) => (
                    <Combobox
                      label="Tags"
                      placeholder="Search or create tags..."
                      items={availableTags}
                      selected={field.value}
                      onChange={field.onChange}
                      onCreate={(name) => handleCreateTag(name, field.onChange, field.value)}
                    />
                  )}
                />
                
                <Controller
                  name="ingredients"
                  control={control}
                  render={({ field }) => (
                    <Combobox
                      label="Ingredients"
                      placeholder="Search or add ingredients..."
                      items={availableIngredients}
                      selected={field.value}
                      onChange={field.onChange}
                      onCreate={(name) => handleCreateIngredient(name, field.onChange, field.value)}
                    />
                  )}
                />
              </div>
            </div>

            {/* Step 3: Review & Submit */}
            <div className={step === 3 ? "block space-y-6" : "hidden"}>
              <h2 className="text-2xl font-bold text-text-primary mb-6">Review your Recipe</h2>
              
              <div className="bg-surface/50 border border-border p-6 rounded-2xl space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-text-secondary uppercase">Title</h3>
                  <p className="text-lg font-bold text-text-primary">{formValues.title || "—"}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-text-secondary uppercase">Time</h3>
                    <p className="text-text-primary font-medium">{formValues.time_minutes} minutes</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-text-secondary uppercase">Price</h3>
                    <p className="text-text-primary font-medium">${Number(formValues.price || 0).toFixed(2)}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-text-secondary uppercase">Tags</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {formValues.tags.length > 0 ? formValues.tags.map(t => (
                      <span key={t.id} className="bg-accent/20 px-2 py-0.5 rounded text-sm font-medium">{t.name}</span>
                    )) : <span className="text-sm text-text-secondary">None</span>}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-text-secondary uppercase">Ingredients</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {formValues.ingredients.length > 0 ? formValues.ingredients.map(i => (
                      <span key={i.id} className="bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded text-sm font-medium">{i.name}</span>
                    )) : <span className="text-sm text-text-secondary">None</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className={`mt-10 flex ${step === 1 ? 'justify-end' : 'justify-between'}`}>
              {step > 1 && (
                <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
                  Back
                </Button>
              )}
              
              {step < totalSteps ? (
                <Button type="button" onClick={handleNext}>
                  Continue
                </Button>
              ) : (
                <Button type="submit" isLoading={isSubmitting || isLoading} className="min-w-[140px]">
                  {initialData ? "Save changes" : "Create recipe"}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
