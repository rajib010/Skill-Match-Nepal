import { User, Shield } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import PersonalTab from "./_components/PersonalTab";
import SecurityTab from "./_components/SecurityTab";
import { getUserDetail } from "./action";
import { notFound } from "next/navigation";

export default async function SettingsPage() {
  const res = await getUserDetail();

  if (!res.success) {
    return notFound();
  }

  const { data } = res;
  return (
    <main className="main-page">
      <div className="">
        <h1 className="text-xl md:text-4xl font-bold text-gray-900 mb-2">
          Account Settings
        </h1>
        <p className="text-gray-600 text-sm md:text-xl">
          Manage your profile and preferences
        </p>
      </div>

      <Card className="overflow-hidden border-none shadow-none w-full md:max-w-2xl mx-auto">
        {/* Profile Header */}
        <CardContent className="pb-8 px-0 sm:px-6">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 h-15">
              <TabsTrigger value="personal" className="gap-2 tabs-color p-4 ">
                <User className="w-4 h-4" />
                <span className="hidden sm:block">Basic Information</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="gap-2 tabs-color p-4 ">
                <Shield className="w-4 h-4" />
                <span className="hidden sm:block">Security</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-8">
              <PersonalTab data={data} />
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <SecurityTab />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  );
}
