"use client";

import React, { useEffect, useState } from "react";
import { deleteFaq, FaqType, reorderFaq } from "../action";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { GripVertical, Loader2, SquarePenIcon, Trash2 } from "lucide-react";
import ManageFaqForm from "./ManageFaqForm";
import { AlertModal } from "../../_components/AlertModal";
import { toast } from "sonner";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

interface FaqLisitingProps {
  faqs: FaqType[];
}

function SortableFaqItems({
  faq,
  onEdit,
  onDelete,
}: {
  faq: FaqType;
  onEdit: (faq: FaqType) => void;
  onDelete: (faq: FaqType) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: faq.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <AccordionItem
      ref={setNodeRef}
      style={style}
      key={faq.id}
      value={faq.id.toString()}
      className="border rounded-lg bg-card px-4"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-5">
          <button
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-accent rounded"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="size-5 text-muted-foreground" />
          </button>
          <AccordionTrigger className="flex-1 hover:no-underline py-4 cursor-pointer">
            <div className="flex items-start gap-3 text-left w-full">
              <span className="font-semibold flex-1">{faq.question}</span>
            </div>
          </AccordionTrigger>
        </div>
        <div className="flex items-center gap-2 ml-2">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(faq);
            }}
          >
            <SquarePenIcon className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(faq);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <AccordionContent className="pl-12 pr-4 pb-4 text-muted-foreground">
        {faq.answer}
      </AccordionContent>
    </AccordionItem>
  );
}

function FaqListing({ faqs: initialFaqs }: FaqLisitingProps) {
  const [faqs, setFaqs] = useState<FaqType[]>(initialFaqs);
  const [selectedFaq, setSelectedFaq] = useState<FaqType>(null);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [isReordering, setIsReordering] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  //update when initial faqs change after search
  useEffect(() => {
    setFaqs(initialFaqs);
  }, [initialFaqs]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    //if drag is not overlaying
    if (!over || active.id === over.id) return;

    const oldIndex = faqs.findIndex((faq) => faq.id === active.id);
    const newIndex = faqs.findIndex((faq) => faq.id === over.id);

    const newFaqs = arrayMove(faqs, oldIndex, newIndex);

    setFaqs(newFaqs);
    setIsReordering(true);

    const res = await reorderFaq({ ids: newFaqs.map((faq) => faq.id) });

    setIsReordering(false);

    if (!res.success) {
      toast.error(res.message);
      setFaqs(faqs);
      return;
    }

    toast.success(res.message);
  };

  if (!isMounted) {
    return (
      <div className="absolute inset-0 w-full h-full flex items-center justify-center">
        <Loader2 className="w-20 h-20 animate-spin" />
      </div>
    );
  }

  return faqs.length === 0 ? (
    <Card className="p-8 text-center">
      <p className="text-muted-foreground">No FAQs found.</p>
    </Card>
  ) : (
    <>
      <div>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={faqs.map((faq) => faq.id)}
            strategy={verticalListSortingStrategy}
          >
            <Accordion type="single" collapsible className="w-full space-y-3">
              {faqs.map((faq) => (
                <SortableFaqItems
                  key={faq.id}
                  faq={faq}
                  onEdit={(faq) => {
                    setSelectedFaq(faq);
                    setShowEditModal(true);
                  }}
                  onDelete={(faq) => {
                    setSelectedFaq(faq);
                    setShowDeleteModal(true);
                  }}
                />
              ))}
            </Accordion>
          </SortableContext>
        </DndContext>
      </div>

      {isReordering && (
        <div className="fixed inset-0 bg-background/50 flex items-center justify-center z-50">
          <Card className="p-4">
            <p className="text-sm">Reordering FAQs...</p>
          </Card>
        </div>
      )}

      {showEditModal && selectedFaq && (
        <ManageFaqForm
          open={showEditModal}
          onClose={() => setShowEditModal((p) => !p)}
          selectedFaq={selectedFaq}
        />
      )}

      {/* delete modal */}
      <AlertModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        action={async () => {
          if (!selectedFaq?.id) return;

          const res = await deleteFaq(selectedFaq.id);

          if (!res.success) {
            toast.error(res.message);
            return;
          }
          toast.success(res.message);

          setShowDeleteModal(false);
          setSelectedFaq(null);
        }}
        description="This action cannot be undone. This will delete the FAQ information permanently and cannot be recovered later."
        mainText="Are you sure you want to delete this FAQ item?"
      />
    </>
  );
}

export default FaqListing;
