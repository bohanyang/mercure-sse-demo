"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useMutation } from "@tanstack/react-query"

const FormSchema = z.object({
    id: z.string(),
    name: z.string(),
    estimatedCalculationTime: z.coerce.number(),
    isCalculating: z.boolean(),
})

export function PublishProject() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      id: "1",
      name: 'Project 1',
      estimatedCalculationTime: 1000,
      isCalculating: true,
    },
  })

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof FormSchema>) => {
      const response = await fetch(`/api/publishProject/${process.env.NEXT_PUBLIC_ORGANIZATION_ID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        throw new Error("Failed to submit data")
      }
      return response.json()
    },
    onSuccess: () => {
      // Handle success (e.g., show a success message or reset the form)
      form.reset()
    },
    onError: (error) => {
      // Handle error (e.g., show an error message)
      console.error(error)
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    mutation.mutate(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>id</FormLabel>
              <FormControl>
                <Input placeholder="1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>name</FormLabel>
              <FormControl>
                <Input placeholder="Project 1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="estimatedCalculationTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>estimatedCalculationTime</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isCalculating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>計算完了</FormLabel>
              <FormControl>
                <Switch checked={!field.value} onCheckedChange={(value) => field.onChange(!value)} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={mutation.isLoading}>
          {mutation.isLoading ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  )
}