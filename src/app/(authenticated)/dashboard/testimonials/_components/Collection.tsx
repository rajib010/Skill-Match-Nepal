"use client";

import React, { useState } from "react";
import { deleteTestimonial, TestimonialType } from "../action";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { SquarePenIcon, Trash2 } from "lucide-react";
import TestimonialForm from "./TestimonialForm";
import { AlertModal } from "../../_components/AlertModal";
import { toast } from "sonner";

interface iAppProps {
  testimonials: TestimonialType[];
  search?: string;
}

export default function TestimonialCollection({
  testimonials,
  search,
}: iAppProps) {
  const [selectedTestimonial, setSelectedTestimonial] =
    useState<TestimonialType | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pr-4 sm:pr-0">
        {Array.isArray(testimonials) &&
          testimonials.map((item) => (
            <Card
              key={item.id}
              className="p-0 bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden"
            >
              <CardHeader className="flex justify-end gap-2 p-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="p-2 rounded-ful"
                  onClick={() => {
                    setSelectedTestimonial(item);
                    setShowEditModal(true);
                  }}
                >
                  <SquarePenIcon className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="p-2 rounded-full"
                  onClick={() => {
                    setShowDeleteModal(true);
                    setSelectedTestimonial(item);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardHeader>

              <CardContent className="flex flex-col items-center gap-4 p-4 py-0">
                <p className="text-center sm:text-xs md:text-lg font-semibold italic min-h-40 flex items-center">
                  &quot;{item.message}&quot;
                </p>

                <div className="flex justify-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={`text-yellow-400 ${
                        i < Number(item.rating) ? "opacity-100" : "opacity-40"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </CardContent>

              <Separator className="border-white/20" />

              <CardFooter className="flex flex-col [.border-t]:pt-0 items-center gap-1 py-2 px-4">
                <p className="font-bold">{item.name}</p>
                <p className="text-sm">{item.address}</p>
              </CardFooter>
            </Card>
          ))}

        {search?.trim() && testimonials.length === 0 && (
          <p className="text-center col-span-full text-white/70 mt-8">
            No result found {search ? `for "${search}"` : "."}
          </p>
        )}
      </div>

      {selectedTestimonial && showEditModal && (
        <TestimonialForm
          open={showEditModal}
          onClose={() => setShowEditModal(false)}
          selectedTestimonial={selectedTestimonial}
        />
      )}

      {/* Delete confirmation */}
      <AlertModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        action={async () => {
          if (!selectedTestimonial?.id) return;

          const res = await deleteTestimonial(selectedTestimonial.id);

          if (!res.success) {
            toast.error(res.message);
            return;
          }

          toast.success(res.message);
          setShowDeleteModal(false);
          setSelectedTestimonial(null);
        }}
        description="This action cannot be undone. This will delete the testimonial permanently."
        mainText="Are you sure you want to delete this testimonial?"
      />
    </>
  );
}
