
import React, { useState } from 'react';
import { Sparkles, SendHorizonal, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import { Link } from 'react-router-dom';

const SAMPLE_PROMPTS = [
  "What's a simple act of kindness I can do for a coworker?",
  "How can I help an elderly neighbor?",
  "What are some ways to show kindness to my family today?",
  "What's a kind act I can do for someone I don't know?",
  "How can I show kindness to someone going through a hard time?"
];

const KIND_ACT_SUGGESTIONS = [
  "Write a handwritten note of appreciation for a coworker or family member.",
  "Offer to help an elderly neighbor with grocery shopping or yard work.",
  "Pay for the coffee or meal of the person behind you in line.",
  "Donate gently used clothing or household items to a local shelter.",
  "Call a friend or family member just to ask how they're doing and listen.",
  "Leave positive sticky notes with encouraging messages in public places.",
  "Compliment a stranger sincerely about something you notice.",
  "Volunteer at a local food bank, animal shelter, or community garden.",
  "Offer to babysit for parents who need a break.",
  "Make a care package for someone who is ill or going through a difficult time.",
  "Clean up litter in your neighborhood or local park.",
  "Share your umbrella with someone on a rainy day.",
  "Bake cookies or a meal for a neighbor, coworker, or friend.",
  "Hold the door open for people behind you.",
  "Send a care package to a military service member.",
  "Read to children at a local library or to residents at a nursing home.",
  "Donate blood at a local blood drive.",
  "Offer to return someone's shopping cart for them.",
  "Start a community garden in your neighborhood.",
  "Create a free library box where people can take or leave books."
];

const IdeasPage: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const generateResponse = async (userPrompt: string) => {
    if (!userPrompt.trim()) {
      toast({
        title: "Please enter a prompt",
        description: "Try asking for an act of kindness idea",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const numSuggestions = Math.floor(Math.random() * 2) + 2;
      const shuffled = [...KIND_ACT_SUGGESTIONS].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, numSuggestions);
      
      const formattedResponse = `Here are some acts of kindness you could try:\n\n${selected.map(s => `• ${s}`).join('\n\n')}`;
      
      setResponse(formattedResponse);
    } catch (error) {
      toast({
        title: "Error generating ideas",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateResponse(prompt);
  };

  const handleUseSamplePrompt = (samplePrompt: string) => {
    setPrompt(samplePrompt);
    generateResponse(samplePrompt);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-5xl pt-24 pb-16 px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-10">
          <Sparkles className="h-12 w-12 text-primary mb-4" />
          <h1 className="text-4xl font-bold mb-3 animate-fade-in">Get Deeds Ideas</h1>
          <p className="text-muted-foreground max-w-2xl">
            Need inspiration for your next good deed? Ask for ideas and get suggestions for acts of kindness. Or, visit the <Link to="/community" className="text-primary hover:underline">Community</Link> page to see what Deeds others are doing.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {SAMPLE_PROMPTS.slice(0, 3).map((samplePrompt, index) => (
            <Card 
              key={index} 
              className="cursor-pointer hover:bg-primary/30 transition-colors"
              onClick={() => handleUseSamplePrompt(samplePrompt)}
            >
              <CardContent className="pt-6">
                <p className="text-sm">{samplePrompt}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Ask for Kind Ideas</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent>
              <Textarea
                placeholder="What kind of good deed are you looking for?"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[120px]"
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                type="button" 
                onClick={() => {
                  const randomIndex = Math.floor(Math.random() * SAMPLE_PROMPTS.length);
                  setPrompt(SAMPLE_PROMPTS[randomIndex]);
                }}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Random Prompt
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Thinking...
                  </>
                ) : (
                  <>
                    <SendHorizonal className="mr-2 h-4 w-4" />
                    Get Ideas
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {response && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Kindness Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap">{response}</div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => generateResponse(prompt)}
                disabled={isLoading}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Generate More Ideas
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
};

export default IdeasPage;
