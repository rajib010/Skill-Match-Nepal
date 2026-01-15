"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";
import React, { useState } from "react";
import { changePasswordSchema, ChangePasswordSchemaType } from "../schema";
import { toast } from "sonner";
import { changePassword } from "@/lib/auth/client";

function SecurityTab() {
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ChangePasswordSchemaType>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      id: "",
      oldPassword: "",
      confirmPassword: "",
      newPassword: "",
    },
  });

  const { isDirty } = form.formState;

  async function onSubmit(values: ChangePasswordSchemaType) {
    try {
      setIsLoading(true);

      if (values.newPassword !== values.confirmPassword) {
        toast.error("Passwords donot match.");
        return;
      }

      if (values.newPassword.trim() === values.oldPassword.trim()) {
        toast.error("New & Old Passwords cannot be the same.");
        return;
      }

      //using better auth
      const result = await changePassword({
        newPassword: values.newPassword,
        currentPassword: values.oldPassword,
        revokeOtherSessions: true,
      });

      if (result.error) {
        toast.error(result.error.message || "Failed to update password.");
        return;
      }

      toast.success("Password updated successfully.");
      form.reset();
    } catch {
      toast.error(`Failed to update user password.`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Card className="px-0 max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Change Password
          </CardTitle>
          <CardDescription>
            Update your password regularly to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* old password */}
              <div>
                <FormField
                  control={form.control}
                  name="oldPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Old Password <span className="required-field">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            disabled={isLoading}
                            type={showPassword.old ? "text" : "password"}
                            autoComplete="oldPassword"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() =>
                              setShowPassword((prev) => ({
                                ...prev,
                                old: !prev.old,
                              }))
                            }
                          >
                            {showPassword.old ? (
                              <EyeOff className="h-4 w-4 text-gray-500" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-500" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* new password */}
              <div>
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        New Password <span className="required-field">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            disabled={isLoading}
                            type={showPassword.new ? "text" : "password"}
                            autoComplete="newPassword"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() =>
                              setShowPassword((prev) => ({
                                ...prev,
                                new: !prev.new,
                              }))
                            }
                          >
                            {showPassword.new ? (
                              <EyeOff className="h-4 w-4 text-gray-500" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-500" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* confirm password */}
              <div>
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Confirm Password{" "}
                        <span className="required-field">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            disabled={isLoading}
                            type={showPassword.confirm ? "text" : "password"}
                            autoComplete="confirmPassword"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() =>
                              setShowPassword((prev) => ({
                                ...prev,
                                confirm: !prev.confirm,
                              }))
                            }
                          >
                            {showPassword.confirm ? (
                              <EyeOff className="h-4 w-4 text-gray-500" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-500" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button disabled={!isDirty || isLoading} className="w-full">
                Update Password
                {isLoading && <Loader2 className="animate-spin" />}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}

export default SecurityTab;
