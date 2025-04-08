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
} from "@/components/ui/select";
import Requirement from "../classes/Requirement";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MultiSelect } from "@/components/MultiSelect";

const formSchema = z.object({
  name: z.string().min(1, { message: "Название требования обязательно" }),
  // initiatorType: z.string().min(1, { message: "Тип инициатора обязателен" }),
  initiator: z.string().min(1, { message: "Инициатор обязателен" }),
  // importance: z
  //   .number()
  //   .min(0)
  //   .max(10, { message: "Важность должна быть в пределах от 0 до 10" }),
  dependency: z.array(z.string()).optional(),
});

function RequirementForm({ onAddRequirement, allRequirements }) {
  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      initiatorType: "",
      initiator: "",
      importance: 5,
      dependency: [],
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = methods;

  const [requirements, setRequirements] = useState(allRequirements || []);
  const [dependencies, setDependencies] = useState(allRequirements || []);

  const onSubmit = (data) => {
    const { name, initiator, dependency } = data;
    const newRequirement = new Requirement(name, initiator, 0, "person");

    if (dependency && dependency.length > 0) {
      dependency
        .filter((depName) => depName !== "no-dependency")
        .forEach((depName) => {
          const dependentReq = requirements.find((req) => req.name === depName);
          if (dependentReq) {
            newRequirement.addDependency(dependentReq);
          }
        });
    }

    // if (initiatorType === "person" || initiatorType === "company") {
    //   newRequirement.initiator = initiatorType + ": " + initiator;
    // }

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

        {/* <FormItem>
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
        </FormItem> */}

        <FormItem>
          <FormLabel>Зависимость от</FormLabel>
          <FormControl>
            <MultiSelect
              options={[
                { label: "Нет зависимости", value: "no-dependency" },
                ...requirements.map((r) => ({ label: r.name, value: r.name })),
              ]}
              selected={watch("dependency") || []}
              onChange={(values) => setValue("dependency", values)}
              placeholder="Выберите зависимости"
            />
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
