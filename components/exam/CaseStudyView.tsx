import SingleChoice from '@/components/questions/SingleChoice';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface CaseStudyViewProps {
    caseStudyId: Id<"caseStudies">;
    question: any;
    selectedAnswer: any;
    onSelectAnswer: (answer: any) => void;
    showResult?: boolean;
}

export default function CaseStudyView({
    caseStudyId,
    question,
    selectedAnswer,
    onSelectAnswer,
    showResult = false
}: CaseStudyViewProps) {
    const caseStudy = useQuery(api.caseStudies.getCaseStudy, { caseStudyId });
    const [activeTab, setActiveTab] = useState<"background" | "environment" | "requirements">("background");

    // We can use simple state to switch tabs
    // Layout: 
    // Top: Tab Bar (Background, Current Env, Requirements)
    // Middle: Scrollable Content of the scenario
    // Bottom: The Question itself (SingleChoice)

    if (!caseStudy) {
        return (
            <View className="flex-1 p-4">
                <Text className="text-text-secondary">Loading Case Study...</Text>
            </View>
        );
    }

    const { scenario } = caseStudy;

    return (
        <View className="flex-1">
            <View className="flex-row border-b border-white/10">
                {(["background", "environment", "requirements"] as const).map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        onPress={() => setActiveTab(tab)}
                        className={`px-4 py-3 border-b-2 ${activeTab === tab ? 'border-pink-hot' : 'border-transparent'}`}
                    >
                        <Text className={`font-bold capitalize ${activeTab === tab ? 'text-white' : 'text-text-secondary'}`}>
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView className="flex-1 bg-bg-secondary p-4 max-h-48 border-b border-white/5">
                <Text className="text-white leading-6">
                    {activeTab === "background" && scenario.background}
                    {activeTab === "environment" && scenario.currentEnvironment}
                    {activeTab === "requirements" && (
                        <View>
                            {scenario.requirements.map((req: string, i: number) => (
                                <Text key={i} className="text-white mb-2">• {req}</Text>
                            ))}
                        </View>
                    )}
                </Text>
            </ScrollView>

            <View className="flex-1 p-4 bg-bg-primary">
                <ScrollView>
                    <SingleChoice
                        question={question.content}
                        selectedAnswer={selectedAnswer}
                        onSelect={onSelectAnswer}
                        showResult={showResult}
                    />
                </ScrollView>
            </View>
        </View>
    );
}
