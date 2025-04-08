import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // для выбора инициатора
import Requirement from "../classes/Requirement";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Создаем схему валидации с помощью Zod
const formSchema = z.object({
  name: z.string().min(1, { message: "Название требования обязательно" }),
  initiatorType: z.string().min(1, { message: "Тип инициатора обязателен" }),
  initiator: z.string().min(1, { message: "Инициатор обязателен" }),
  importance: z
    .number()
    .min(0)
    .max(10, { message: "Важность должна быть в пределах от 0 до 10" }),
  dependency: z.string().optional(), // Зависимость от другого требования
});

function RequirementForm({ onAddRequirement, allRequirements }) {
  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      initiatorType: "",
      initiator: "",
      importance: 5,
      dependency: "",
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = methods;

  const [requirements, setRequirements] = useState(allRequirements || []);
  const [dependencies, setDependencies] = useState(allRequirements || []);

  const onSubmit = (data) => {
    const { name, initiator, importance, dependency, initiatorType } = data;
    const newRequirement = new Requirement(
      name,
      initiator,
      importance,
      initiatorType
    );

    if (dependency) {
      const dependentReq = requirements.find((req) => req.name === dependency);
      if (dependentReq) {
        newRequirement.addDependency(dependentReq);
      }
    }

    if (initiatorType === "person" || initiatorType === "company") {
      newRequirement.initiator = initiatorType + ": " + initiator;
    }

    setRequirements((prev) => [...prev, newRequirement]);
    onAddRequirement(newRequirement);

    reset();
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormItem>
          <FormLabel htmlFor="name">Название требования</FormLabel>
          <FormControl>
            <Input
              {...methods.register("name")}
              name="name"
              id="name"
              placeholder="Введите название"
              required
            />
          </FormControl>
          {errors.name && <FormMessage>{errors.name.message}</FormMessage>}
        </FormItem>

        <FormItem>
          <FormLabel htmlFor="initiatorType">Тип инициатора</FormLabel>
          <FormControl>
            <Select
              {...methods.register("initiatorType")}
              name="initiatorType"
              onValueChange={(value) => setValue("initiatorType", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите тип инициатора" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="person">Человек</SelectItem>
                  <SelectItem value="company">Компания</SelectItem>
                  <SelectItem value="requirement">Требование</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </FormControl>
          {errors.initiatorType && (
            <FormMessage>{errors.initiatorType.message}</FormMessage>
          )}
        </FormItem>

        <FormItem>
          <FormLabel htmlFor="initiator">Инициатор</FormLabel>
          <FormControl>
            <Input
              {...methods.register("initiator")}
              name="initiator"
              id="initiator"
              placeholder="Введите инициатора"
              required
            />
          </FormControl>
          {errors.initiator && (
            <FormMessage>{errors.initiator.message}</FormMessage>
          )}
        </FormItem>

        <FormItem>
          <FormLabel htmlFor="importance">Важность (0-10)</FormLabel>
          <FormControl>
            <Input
              {...methods.register("importance", { valueAsNumber: true })}
              name="importance"
              id="importance"
              type="number"
              min="0"
              max="10"
              placeholder="Введите важность"
              required
            />
          </FormControl>
          {errors.importance && (
            <FormMessage>{errors.importance.message}</FormMessage>
          )}
        </FormItem>

        <FormItem>
          <FormLabel htmlFor="dependency">Зависимость от</FormLabel>
          <FormControl>
            <Select
              {...methods.register("dependency")}
              name="dependency"
              onValueChange={(value) => setValue("dependency", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите зависимость" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="no-dependency">Нет зависимости</SelectItem>
                  {requirements.map((req) => (
                    <SelectItem key={req.name} value={req.name}>
                      {req.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </FormControl>
          {errors.dependency && (
            <FormMessage>{errors.dependency.message}</FormMessage>
          )}
        </FormItem>

        <Button type="submit" className="mt-4">
          Добавить требование
        </Button>
      </form>
    </FormProvider>
  );
}

export default RequirementForm;
