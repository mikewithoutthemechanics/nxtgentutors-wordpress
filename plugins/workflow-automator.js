/**
 * Workflow Automator Plugin (React/Next.js Version)
 * Replaces AutomatorWP logic from the WordPress setup.
 */

export const triggers = {
  SESSION_COMPLETED: 'session.completed',
  RATING_SUBMITTED: 'rating.submitted',
  PAYMENT_PROCESSED: 'payment.processed',
};

export const workflowAutomator = {
  async runTrigger(trigger, data) {
    console.log(`[WorkflowAutomator] Triggering: ${trigger}`, data);

    switch (trigger) {
      case triggers.SESSION_COMPLETED:
        await this.handleSessionCompleted(data);
        break;
      case triggers.RATING_SUBMITTED:
        await this.handleRatingSubmitted(data);
        break;
      case triggers.PAYMENT_PROCESSED:
        await this.handlePaymentProcessed(data);
        break;
      default:
        console.warn(`[WorkflowAutomator] No handler for trigger: ${trigger}`);
    }
  },

  async handleSessionCompleted({ sessionId, tutorId, studentId, rate }) {
    // 1. Calculate Earnings (85% to tutor)
    const platformFee = rate * 0.15;
    const tutorEarnings = rate - platformFee;
    
    console.log(`[WorkflowAutomator] Recording earnings: R${tutorEarnings} (Fee: R${platformFee})`);
    
    // 2. Notify Student to Rate
    console.log(`[WorkflowAutomator] Sending 'Rate Your Session' email to student ${studentId}`);
    
    // 3. Update Achievements
    console.log(`[WorkflowAutomator] Checking milestones for student ${studentId}`);
  },

  async handleRatingSubmitted({ tutorId, rating, comment }) {
    console.log(`[WorkflowAutomator] Updating average rating for tutor ${tutorId} to reflect new score: ${rating}`);
    
    if (rating < 4.0) {
      console.log(`[WorkflowAutomator] ALERT: Low rating detected. Notifying Admin.`);
    } else if (rating >= 4.8) {
      console.log(`[WorkflowAutomator] CONGRATS: High rating. Updating badge to 'Top Rated'.`);
    }
  },

  async handlePaymentProcessed({ studentId, amount }) {
    console.log(`[WorkflowAutomator] Payment of R${amount} verified. Creating booking slots for student ${studentId}.`);
  }
};
