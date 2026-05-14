'use server';
/**
 * @fileOverview This file implements a Genkit flow for an AI-powered medication reminder and notification system.
 *
 * - aiMedicationReminderAndNotification - A function that generates personalized medication reminders and
 *   optionally sends notifications to relatives if a dose is missed.
 * - AIMedicationReminderInput - The input type for the aiMedicationReminderAndNotification function.
 * - AIMedicationReminderOutput - The return type for the aiMedicationReminderAndNotification function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Helper function to format timestamp
function formatTimestamp(timestampMs: number | null): string {
  if (timestampMs === null) {
    return 'Not available';
  }
  return new Date(timestampMs).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

// Input Schema for the flow
const AIMedicationReminderInputSchema = z.object({
  patientName: z.string().describe("The patient's full name."),
  medicationName: z.string().describe("The name of the medication (e.g., 'Insulin', 'Lisinopril')."),
  dosage: z.string().describe("The dosage of the medication (e.g., '1 tablet', '5mg')."),
  scheduleDescription: z.string().describe("A descriptive string of the medication schedule (e.g., 'twice daily, at 8 AM and 6 PM')."),
  lastTakenTimestampMs: z.number().nullable().describe("Unix timestamp in milliseconds when the medication was last taken. Null if never taken or not recorded."),
  nextScheduledDoseTimestampMs: z.number().describe("Unix timestamp in milliseconds for the next scheduled dose."),
  currentTimestampMs: z.number().describe("The current Unix timestamp in milliseconds, used to evaluate if a dose is missed."),
  relativeName: z.string().describe("The name of the relative to be notified."),
  relativeRelationship: z.string().describe("The relationship of the relative to the patient (e.g., 'daughter', 'caregiver')."),
});
export type AIMedicationReminderInput = z.infer<typeof AIMedicationReminderInputSchema>;

// Output Schema for the flow
const AIMedicationReminderOutputSchema = z.object({
  patientReminderMessage: z.string().describe("A clear and personalized reminder message for the patient."),
  relativeNotificationMessage: z.string().nullable().describe("A concise notification message for the relative, or null if no notification is needed."),
});
export type AIMedicationReminderOutput = z.infer<typeof AIMedicationReminderOutputSchema>;

// Schema for prompt input (derives from flow input, adding formatted dates)
const PromptInputSchema = AIMedicationReminderInputSchema.extend({
  formattedCurrentTime: z.string(),
  formattedNextScheduledDoseTime: z.string(),
  formattedLastTakenTime: z.string(),
});

// Prompt for patient reminder
const patientReminderPrompt = ai.definePrompt({
  name: 'patientMedicationReminderPrompt',
  input: { schema: PromptInputSchema }, // Use the extended schema
  output: { schema: z.object({ reminder: z.string() }) },
  prompt: `You are a helpful health assistant. Create a clear and personalized medication reminder for the patient.\nEmphasize the importance of taking the medication on time for their well-being.\nInclude the medication details, dosage, and schedule.\n\nPatient: {{{patientName}}}\nMedication: {{{medicationName}}}\nDosage: {{{dosage}}}\nSchedule: {{{scheduleDescription}}}\n\nCurrent Time: {{{formattedCurrentTime}}}\nNext Scheduled Dose: {{{formattedNextScheduledDoseTime}}}\nLast Taken: {{{formattedLastTakenTime}}}\n\nReminder:`,
});

// Prompt for relative notification
const relativeNotificationPrompt = ai.definePrompt({
  name: 'relativeMissedDoseNotificationPrompt',
  input: { schema: PromptInputSchema }, // Use the extended schema
  output: { schema: z.object({ notification: z.string() }) },
  prompt: `You are an AI assistant for patient care. The patient, {{{patientName}}}, has potentially missed a dose of {{{medicationName}}} (Dosage: {{{dosage}}}).\nPlease create a concise and urgent notification message for their relative, {{{relativeName}}} (who is their {{{relativeRelationship}}}), asking them to check in with the patient.\nEmphasize the importance of timely medication and encourage them to ensure the patient takes their medication soon.\n\nThe notification should be brief and to the point.\n\nPatient: {{{patientName}}}\nMedication: {{{medicationName}}}\nDosage: {{{dosage}}}\nSchedule: {{{scheduleDescription}}}\nCurrent Time: {{{formattedCurrentTime}}}\nMissed Scheduled Dose (was due at): {{{formattedNextScheduledDoseTime}}}\nLast Taken: {{{formattedLastTakenTime}}}\n\nNotification for {{{relativeName}}}:`,
});


export async function aiMedicationReminderAndNotification(
  input: AIMedicationReminderInput
): Promise<AIMedicationReminderOutput> {
  return aiMedicationReminderAndNotificationFlow(input);
}

const aiMedicationReminderAndNotificationFlow = ai.defineFlow(
  {
    name: 'aiMedicationReminderAndNotificationFlow',
    inputSchema: AIMedicationReminderInputSchema,
    outputSchema: AIMedicationReminderOutputSchema,
  },
  async (input) => {
    // Prepare formatted dates for the prompts
    const promptInput = {
      ...input,
      formattedCurrentTime: formatTimestamp(input.currentTimestampMs),
      formattedNextScheduledDoseTime: formatTimestamp(input.nextScheduledDoseTimestampMs),
      formattedLastTakenTime: formatTimestamp(input.lastTakenTimestampMs),
    };

    // 1. Generate the patient reminder message
    const patientReminderResponse = await patientReminderPrompt(promptInput);
    const patientReminderMessage = patientReminderResponse.output?.reminder || 'Could not generate patient reminder.';

    let relativeNotificationMessage: string | null = null;

    // 2. Determine if a dose is missed and a relative notification is needed
    // A dose is considered missed if:
    // a) The current time is past the next scheduled dose time AND
    // b) The medication was not taken at or after the scheduled time (or never taken before current time for this dose).
    const isDoseOverdue = input.currentTimestampMs > input.nextScheduledDoseTimestampMs;
    const hasCurrentScheduledDoseBeenTaken = input.lastTakenTimestampMs !== null && input.lastTakenTimestampMs >= input.nextScheduledDoseTimestampMs;

    const isDoseMissed = isDoseOverdue && !hasCurrentScheduledDoseBeenTaken;

    if (isDoseMissed) {
      // 3. If a dose is missed, generate the relative notification message
      const relativeNotificationResponse = await relativeNotificationPrompt(promptInput);
      relativeNotificationMessage = relativeNotificationResponse.output?.notification || 'Could not generate relative notification.';
    }

    return {
      patientReminderMessage,
      relativeNotificationMessage,
    };
  }
);
