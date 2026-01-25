"use client";

import { memo, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JobsType, updateJob } from "../action";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { IconX } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { jobSchema, JobSchemaType } from "../schema";
import DialogWrapper from "../../_components/dialog-wrapper";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PlusIcon } from "lucide-react";
import { CategoryType, getMinimalCategories } from "../../categories/actions";
import RichTextEditor from "@/app/(authenticated)/_components/rich-text/Editor";
import { formatDateForCalender, getToday } from "@/app/(authenticated)/utils";

interface iAppProps {
  isOpen: boolean;
  onClose: () => void;
  job: JobsType;
}

export const JobEditModal = memo(function JobEditModal({
  isOpen,
  onClose,
  job,
}: iAppProps) {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [descriptionCount, setSetDescriptionCount] = useState<number>(0);
  const DESCRIPTION_LIMIT = 1000;
  const [newSkill, setNewSkill] = useState("");

  const form = useForm<JobSchemaType>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      id: job.id || "",
      title: job.title || "",
      salary: job.salary || "",
      company: job.company || "",
      description:
        typeof job.description === "string"
          ? job.description
          : JSON.stringify(job.description),
      isActive: job.isActive || false,
      location: job.location || "",
      jobType: job.jobType || "",
      categoryId: job.categoryId || "",
      requirements: job.requirements || [],
      expiresAt: formatDateForCalender(job.expiresAt) || "",
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "requirements",
  });

  const { isDirty, isSubmitting, errors } = form.formState;

  const addRequirement = () => {
    if (!newSkill.trim()) {
      return;
    }

    // Check if skill already exists
    const exists = fields.some(
      (field) => field.skillName.toLowerCase() === newSkill.trim().toLowerCase()
    );

    if (exists) {
      toast.error("This skill has already been added");
      return;
    }

    append({ skillName: newSkill.trim(), required: true });
    setNewSkill("");
  };

  const removeRequirement = (index: number) => {
    remove(index);
  };

  const toggleRequired = (index: number) => {
    const field = fields[index];
    update(index, { ...field, required: !field.required });
  };

  const onSubmit = async (data: JobSchemaType) => {
    if (descriptionCount <= 5) {
      form.setError("description", {
        type: "min",
        message: "Description should be at least 5 characters.",
      });
      return;
    }

    if (descriptionCount >= DESCRIPTION_LIMIT) {
      form.setError("description", {
        type: "max",
        message: `Description should be at max ${DESCRIPTION_LIMIT} characters.`,
      });
      return;
    }

    try {
      const result = await updateJob(data);

      if (result.success) {
        toast.success("Job updated successfully");
        onClose();
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Failed to update job");
    } finally {
    }
  };

  useEffect(() => {
    if (categories.length > 0) return;

    async function fetchCategories() {
      try {
        const res = await getMinimalCategories();
        const cats = res.success ? res.data : [];
        setCategories(cats);
      } catch (error) {
        toast.error("Failed to load categories");
        console.error(error);
      } finally {
        setLoadingCategories(false);
      }
    }

    fetchCategories();
  }, [categories.length]);

  if (!isOpen) return null;

  return (
    <DialogWrapper
      isOpen={isOpen}
      noAutoClose={isDirty}
      onOpenChange={onClose}
      title="Edit Job"
      key={"edit job"}
    >
      <div className="space-y-4 py-4 w-full max-w-3xl shadow-sm rounded-md mx-auto p-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* title */}
            <div>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Job Title
                      <span className="required-field">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter job title"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* company name */}
            <div>
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Company Name
                      <span className="required-field">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the company's name"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="w-full flex flex-col sm:flex-row gap-4">
              {/* location */}
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Location
                        <span className="required-field">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter the job location"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* job type */}
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="jobType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Job Type
                        <span className="required-field">*</span>
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full cursor-pointer">
                            <SelectValue placeholder="Select job type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="full-time">Full Time</SelectItem>
                            <SelectItem value="part-time">Part Time</SelectItem>
                            <SelectItem value="contract">Contract</SelectItem>
                            <SelectItem value="internship">
                              Internship
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="w-full flex flex-col sm:flex-row gap-4">
              {/* salary */}
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="salary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Salary (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter the offered salary range"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* job category */}
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Category <span className="required-field">*</span>
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full cursor-pointer">
                            <SelectValue placeholder="Select job category" />
                          </SelectTrigger>
                          <SelectContent className="max-h-[300px] overflow-y-auto">
                            {loadingCategories ? (
                              <SelectItem value="loading" disabled>
                                Loading categories...
                              </SelectItem>
                            ) : categories.length === 0 ? (
                              <SelectItem value="empty" disabled>
                                No categories available
                              </SelectItem>
                            ) : (
                              categories.map((item, idx) => (
                                <SelectItem
                                  key={item.id + "-" + idx}
                                  value={item.id}
                                >
                                  {item.name}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* description */}
            <div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Description <span className="required-field">*</span>
                    </FormLabel>
                    <FormControl>
                      <RichTextEditor
                        field={field}
                        setDescriptionCount={setSetDescriptionCount}
                        limit={DESCRIPTION_LIMIT}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* job availability */}
            <div>
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Job Status
                      <span className="required-field">*</span>
                    </FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="cursor-pointer"
                      />
                    </FormControl>
                    <FormDescription>
                      Active jobs are shown to the candidates.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* job availability */}
            <div>
              <FormField
                control={form.control}
                name="expiresAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Expiry Date
                      <span className="required-field">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        min={getToday()}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>
                      Active jobs are shown to the candidates.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* skills required */}
            <div className="space-y-4">
              <Label>
                Skills Required <span className="required-field">*</span>
              </Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addRequirement();
                    }
                  }}
                  disabled={isSubmitting}
                />
                <Button
                  type="button"
                  onClick={addRequirement}
                  size="icon"
                  disabled={isSubmitting}
                >
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </div>

              {fields.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border rounded-md"
                    >
                      <span className="text-sm">{field.skillName}</span>
                      <Badge
                        variant={field.required ? "default" : "secondary"}
                        className="text-xs cursor-pointer"
                        onClick={() => toggleRequired(index)}
                      >
                        {field.required ? "Required" : "Preferred"}
                      </Badge>
                      <button
                        type="button"
                        onClick={() => removeRequirement(index)}
                        className="text-red-600 hover:text-red-800"
                        disabled={isSubmitting}
                      >
                        <IconX className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {errors.requirements && (
                <p className="text-sm font-medium text-destructive">
                  {errors.requirements.message}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Job"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </DialogWrapper>
  );
});
