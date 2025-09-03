"use client";

import { useFormStatus } from "react-dom";
import { useActionState, useEffect, useRef } from "react";
import { Bot, Loader2, Sparkles } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FormState, getPersonalizedSettings } from "./actions";
import { useToast } from "@/hooks/use-toast";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Thinking...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Personalize My Settings
        </>
      )}
    </Button>
  );
}

export default function PersonalizationForm() {
  const initialState: FormState = { message: "" };
  const [state, formAction] = useActionState(getPersonalizedSettings, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message.startsWith("Success")) {
      toast({
        title: "Settings Personalized!",
        description: "Your AI-powered recommendations are ready.",
      });
      formRef.current?.reset();
    } else if (state.message.startsWith("Error")) {
      toast({
        title: "Validation Error",
        description: state.issues?.join("\n") || "Please check your input.",
        variant: "destructive",
      });
    } else if (state.message) {
         toast({
            title: "Something went wrong",
            description: state.message,
            variant: "destructive",
        });
    }
  }, [state, toast]);

  return (
    <div className="space-y-8">
      <Card className="rounded-2xl shadow-lg">
        <form ref={formRef} action={formAction}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-primary" />
              AI Helmet Personalization
            </CardTitle>
            <CardDescription>
              Describe your riding habits and what you value most. Our AI will
              recommend the perfect settings for you.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid w-full gap-2">
              <Label htmlFor="usagePatterns">Your Usage Patterns</Label>
              <Textarea
                id="usagePatterns"
                name="usagePatterns"
                placeholder="e.g., 'I commute 10 miles daily in city traffic and enjoy long countryside rides on weekends.'"
                rows={4}
                required
              />
              {state.issues && state.issues.find(issue => issue.includes('usage')) && (
                 <p className="text-sm text-destructive">{state.issues.find(issue => issue.includes('usage'))}</p>
              )}
            </div>
            <div className="grid w-full gap-2">
              <Label htmlFor="preferences">Your Preferences</Label>
              <Textarea
                id="preferences"
                name="preferences"
                placeholder="e.g., 'I prioritize maximum safety and visibility. A comfortable, snug fit is also very important to me.'"
                rows={4}
                required
              />
               {state.issues && state.issues.find(issue => issue.includes('preferences')) && (
                 <p className="text-sm text-destructive">{state.issues.find(issue => issue.includes('preferences'))}</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>

      {state.data && (
        <Card className="rounded-2xl shadow-lg animate-in fade-in-50 duration-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-accent" />
              Your Recommended Settings
            </CardTitle>
            <CardDescription>
              Based on your input, here are our AI's suggestions for an optimal
              experience.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">
                Recommended Settings
              </h3>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {state.data.recommendedSettings}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Explanation</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {state.data.explanation}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
