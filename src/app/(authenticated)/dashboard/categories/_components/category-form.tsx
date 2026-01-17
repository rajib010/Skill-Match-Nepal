"use client";

import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { addNewCategory, CategoryType, updateCategoryInfo } from "../actions";
import { categorySchema, CategorySchemaType } from "../schema";
import DialogWrapper from "../../_components/dialog-wrapper";
import { Textarea } from "@/components/ui/textarea";

interface iAppProps {
  open: boolean;
  onClose: () => void;
  selectedCategory?: CategoryType | null;
}

export default function ManageCategoryForm({
  open,
  onClose,
  selectedCategory,
}: iAppProps) {
  const router = useRouter();

  const form = useForm<CategorySchemaType>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      id: "",
      name: "",
      description: "",
    },
  });

  const { isDirty, isSubmitting } = form.formState;

  useEffect(() => {
    if (selectedCategory) {
      form.reset({
        id: selectedCategory.id,
        name: selectedCategory.name,
        description: selectedCategory.description,
      });
    } else {
      form.reset({
        id: "",
        name: "",
        description: "",
      });
    }
  }, [selectedCategory, form]);

  async function onSubmit(data: CategorySchemaType) {
    try {
      const result = selectedCategory
        ? await updateCategoryInfo(data)
        : await addNewCategory(data);

      if (result.success) {
        toast.success(result.message);
        onClose();
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error(
        `Failed to ${selectedCategory ? "update" : "create"} category.`
      );
    }
  }

  return (
    <DialogWrapper
      isOpen={open}
      onOpenChange={onClose}
      noAutoClose={isDirty}
      title={
        selectedCategory ? "Update Category Information" : "Add New Category"
      }
    >
      <div className="space-y-4 py-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Category Name */}
            <div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Category Name <span className="required-field">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter category title"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter category description"
                        disabled={isSubmitting}
                        rows={30}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            type="button"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={isSubmitting || !isDirty}
          >
            {isSubmitting ? (
              selectedCategory ? (
                <>
                  Update Category <Loader2 className="animate-spin" />
                </>
              ) : (
                <>
                  Add Category <Loader2 className="animate-spin" />
                </>
              )
            ) : selectedCategory ? (
              "Update Category"
            ) : (
              "Add Category"
            )}
          </Button>
        </DialogFooter>
      </div>
    </DialogWrapper>
  );
}
