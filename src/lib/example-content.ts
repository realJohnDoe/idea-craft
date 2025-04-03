import { Item } from "./content-utils";

// Function to create dates relative to today
const createDate = (dayOffset: number = 0): Date => {
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);
  return date;
};

// Generate YAML function to ensure example items have proper YAML
const generateYaml = (content: Partial<Item>): string => {
  // This is a simplified version - the real function has more logic
  const parts = [];

  if (content.hasTaskAttributes && content.done !== undefined) {
    parts.push(`task:\n  done: ${content.done}`);
  }

  if (content.hasEventAttributes && content.date) {
    parts.push(`event:\n  date: ${content.date.toISOString().split('T')[0]}`);
    if (content.location) {
      parts.push(`  location: ${content.location}`);
    }
  }

  if (content.hasMailAttributes && content.from) {
    parts.push(`mail:\n  from: ${content.from}`);
    if (content.to && content.to.length > 0) {
      parts.push(`  to:\n    - ${content.to.join('\n    - ')}`);
    }
  }

  if (content.tags && content.tags.length > 0) {
    parts.push(`tags:\n  - ${content.tags.join('\n  - ')}`);
  }

  return parts.join('\n');
};

// Example content items
export const exampleContentItems: Item[] = [
  // Note 1: Project Overview
  {
    id: "note-1",
    title: "Project Overview: Product Launch Q2",
    content: "This is our central hub for the Q2 product launch. All related tasks, events, and communications will be linked here.\n\nKey objectives:\n1. Finalize product specifications by [[Design Review Meeting]]\n2. Complete marketing materials before [[Marketing Strategy Session]]\n3. Ensure all [[Product Launch Tasks]] are assigned and tracked\n4. Prepare [[Press Release Draft]] for approval",
    createdAt: createDate(-30),
    updatedAt: createDate(-25),
    tags: ["project", "product-launch", "planning"],
    yaml: "",
  },
  
  // Task 1: Design Review
  {
    id: "task-1",
    title: "Design Review Meeting",
    content: "Review the final design mockups with the UX team. Make sure all designs are accessible and consistent with brand guidelines.\n\nAttendees:\n- Design Lead\n- Product Manager\n- Frontend Developer\n- Accessibility Specialist\n\nPrepare by reviewing [[UX Research Findings]]",
    createdAt: createDate(-28),
    updatedAt: createDate(-20),
    tags: ["design", "meeting", "product-launch"],
    done: true,
    date: createDate(-15),
    location: "Meeting Room A",
    yaml: "",
  },
  
  // Note 2: UX Research Findings
  {
    id: "note-2",
    title: "UX Research Findings",
    content: "Summary of our user research conducted in Q1:\n\n- 85% of users prefer the new navigation system\n- Most users struggled with the checkout process (see [[Checkout Flow Redesign]])\n- Mobile users spend 3x more time on the product page compared to desktop users\n- Users frequently request better search functionality\n\nDetailed research data can be found in the [[Research Database Link]]",
    createdAt: createDate(-45),
    updatedAt: createDate(-40),
    tags: ["research", "UX", "user-testing"],
    yaml: "",
  },
  
  // Task 2: Checkout Flow Redesign
  {
    id: "task-2",
    title: "Checkout Flow Redesign",
    content: "Redesign the checkout flow based on the feedback from [[UX Research Findings]].\n\nKey improvements needed:\n1. Reduce number of steps\n2. Clearer error messaging\n3. Better mobile layout\n4. Save payment info option\n\nSchedule review with the team after completing the first draft.",
    createdAt: createDate(-25),
    updatedAt: createDate(-18),
    tags: ["design", "UX", "checkout", "high-priority"],
    done: false,
    yaml: "",
  },
  
  // Mail 1: Design Feedback
  {
    id: "mail-1",
    title: "Design Feedback from CEO",
    content: "Just got some feedback from the CEO on the new designs. He loves the direction but has a few concerns about the color scheme and logo placement.\n\nActions needed:\n1. Schedule meeting with design team to address feedback\n2. Update the designs in [[Checkout Flow Redesign]]\n3. Prepare revised mockups for presentation at [[Marketing Strategy Session]]\n\nLet's discuss this at our next team meeting.",
    createdAt: createDate(-20),
    updatedAt: createDate(-20),
    tags: ["feedback", "design", "CEO"],
    from: "ceo@company.com",
    to: ["design.lead@company.com", "product.manager@company.com"],
    yaml: "",
  },
  
  // Event 1: Marketing Strategy Session
  {
    id: "event-1",
    title: "Marketing Strategy Session",
    content: "Quarterly marketing strategy session to plan the product launch campaign.\n\nAgenda:\n1. Review market analysis\n2. Finalize messaging framework\n3. Review channel strategy\n4. Budget allocation\n5. Timeline approval\n\nPrepare the [[Marketing Campaign Brief]] before this meeting. Follow up with [[Marketing Tasks]] assignments.",
    createdAt: createDate(-15),
    updatedAt: createDate(-10),
    tags: ["marketing", "strategy", "product-launch"],
    date: createDate(5),
    location: "Conference Room B + Zoom",
    yaml: "",
  },
  
  // Note 3: Marketing Campaign Brief
  {
    id: "note-3",
    title: "Marketing Campaign Brief",
    content: "# Product Launch Campaign Brief\n\n## Target Audience\n- Primary: Small business owners, ages 35-50\n- Secondary: Freelance professionals, ages 25-40\n\n## Key Messaging\n- Streamlined workflow\n- Cost-effective solution\n- Time-saving features\n\n## Channels\n- Social media (LinkedIn, Twitter)\n- Email marketing\n- Content partnerships\n- Industry events\n\nThis brief will be reviewed during the [[Marketing Strategy Session]].",
    createdAt: createDate(-18),
    updatedAt: createDate(-12),
    tags: ["marketing", "campaign", "brief"],
    yaml: "",
  },
  
  // Task 3: Marketing Tasks
  {
    id: "task-3",
    title: "Marketing Tasks",
    content: "## Marketing Tasks for Q2 Launch\n\n- [ ] Finalize marketing collateral\n- [ ] Update website with new product features\n- [ ] Prepare social media campaign\n- [ ] Brief PR agency\n- [x] Create email templates\n- [ ] Schedule promotional activities\n\nRefer to [[Marketing Campaign Brief]] for messaging guidance.\nAssign tasks after [[Marketing Strategy Session]].",
    createdAt: createDate(-12),
    updatedAt: createDate(-5),
    tags: ["marketing", "tasks", "product-launch"],
    done: false,
    yaml: "",
  },
  
  // Mail 2: Press Release Draft
  {
    id: "mail-2",
    title: "Press Release Draft",
    content: "Attached is the draft of the press release for the product launch.\n\n## Company Announces Revolutionary New Feature\n\n[Company Name] today announced the upcoming release of [Product Name], featuring revolutionary new capabilities that will transform how businesses manage their workflows.\n\n\"This is a game-changer for our customers,\" said [CEO Name], Chief Executive Officer. \"We've listened to feedback and delivered a solution that addresses the biggest pain points in the industry.\"\n\nPlease review and provide feedback by [[Press Release Review]].",
    createdAt: createDate(-8),
    updatedAt: createDate(-8),
    tags: ["PR", "press-release", "communications"],
    from: "pr.manager@company.com",
    to: ["marketing.director@company.com", "product.manager@company.com", "ceo@company.com"],
    yaml: "",
  },
  
  // Task 4: Press Release Review
  {
    id: "task-4",
    title: "Press Release Review",
    content: "Review the [[Press Release Draft]] and provide feedback to the PR team.\n\nChecklist:\n- [ ] Verify all product features are correctly described\n- [ ] Check for compliance with branding guidelines\n- [ ] Confirm all quotes are approved\n- [ ] Ensure release date is correct\n- [ ] Final approval from legal team\n\nDeadline: Before the [[Product Launch Meeting]].",
    createdAt: createDate(-8),
    updatedAt: createDate(-5),
    tags: ["PR", "review", "product-launch"],
    done: false,
    yaml: "",
  },
  
  // Event 2: Product Launch Meeting
  {
    id: "event-2",
    title: "Product Launch Meeting",
    content: "Final team meeting before the product launch.\n\nAgenda:\n1. Status update on all [[Product Launch Tasks]]\n2. Final review of [[Marketing Campaign Brief]]\n3. Review of [[Press Release Draft]]\n4. Contingency planning\n5. Day-of-launch schedule\n\nAll team leads must attend with status reports on their areas of responsibility.",
    createdAt: createDate(-5),
    updatedAt: createDate(-1),
    tags: ["meeting", "product-launch", "planning"],
    date: createDate(10),
    location: "Main Conference Room",
    yaml: "",
  },
  
  // Task 5: Product Launch Tasks
  {
    id: "task-5",
    title: "Product Launch Tasks",
    content: "Master checklist for product launch:\n\n- [x] Complete product development\n- [x] Finalize feature set\n- [x] Complete QA testing\n- [ ] Prepare customer documentation\n- [ ] Train customer support team\n- [ ] Set up monitoring systems\n- [ ] Prepare rollback plan\n\nAll items must be completed before [[Product Launch Meeting]].",
    createdAt: createDate(-30),
    updatedAt: createDate(-2),
    tags: ["product-launch", "checklist", "high-priority"],
    done: false,
    yaml: "",
  },
  
  // Note 4: Research Database Link
  {
    id: "note-4",
    title: "Research Database Link",
    content: "Access to our UX research database:\n\n[Internal Link: ux-research.company.com/q1-findings]\n\nContains all raw data from our Q1 user testing sessions, including:\n- User recordings\n- Survey responses\n- Heat maps\n- Session analytics\n\nThis data informed our [[UX Research Findings]] document.",
    createdAt: createDate(-50),
    updatedAt: createDate(-50),
    tags: ["research", "database", "resources"],
    yaml: "",
  },
  
  // Task 6: Legal Review of Terms
  {
    id: "task-6",
    title: "Legal Review of Terms",
    content: "Get legal department to review updated terms of service for product launch.\n\nPoints to address:\n- New feature accessibility compliance\n- Data processing terms\n- User privacy updates\n- International regulations compliance\n\nNeed this completed before we can finalize the [[Press Release Draft]].",
    createdAt: createDate(-15),
    updatedAt: createDate(-10),
    tags: ["legal", "compliance", "product-launch"],
    done: true,
    yaml: "",
  },
  
  // Mail 3: Investor Update
  {
    id: "mail-3",
    title: "Investor Update on Product Launch",
    content: "Prepared email to investors updating them on our upcoming product launch:\n\nDear Investors,\n\nI'm excited to share that we're on track for our Q2 product launch. Based on our [[UX Research Findings]], we've developed features that directly address our users' most significant pain points.\n\nOur [[Marketing Strategy Session]] is scheduled for next week, and we're finalizing our go-to-market approach. The team has completed key milestones in our [[Product Launch Tasks]] list, and we remain on budget and on schedule.\n\nI'll send another update following our [[Product Launch Meeting]] with final details.\n\nBest regards,\nCEO",
    createdAt: createDate(-7),
    updatedAt: createDate(-7),
    tags: ["investors", "communication", "product-launch"],
    from: "ceo@company.com",
    to: ["investor.relations@company.com"],
    yaml: "",
  },
  
  // Note 5: Competitive Analysis
  {
    id: "note-5",
    title: "Competitive Analysis",
    content: "# Competitive Landscape Analysis\n\n## Main Competitors\n1. CompetitorA - Strong in enterprise market\n2. CompetitorB - Best UX but limited features\n3. CompetitorC - Low cost leader\n\n## Our Advantages\n- Better integration capabilities\n- More customization options\n- Stronger security features\n- Better performance metrics\n\nThis analysis should inform our [[Marketing Campaign Brief]] and help us position against competitors.",
    createdAt: createDate(-40),
    updatedAt: createDate(-35),
    tags: ["analysis", "competition", "strategy"],
    yaml: "",
  },
  
  // Event 3: Post-Launch Review
  {
    id: "event-3",
    title: "Post-Launch Review",
    content: "Team retrospective on the product launch.\n\nAgenda:\n1. Performance metrics review\n2. Customer feedback analysis\n3. Technical issues review\n4. Marketing campaign effectiveness\n5. Lessons learned\n6. Next steps planning\n\nCome prepared with data from your respective areas.\n\nFollowing up on issues raised during [[Product Launch Meeting]].",
    createdAt: createDate(-2),
    updatedAt: createDate(-1),
    tags: ["retrospective", "product-launch", "review"],
    date: createDate(30),
    location: "Conference Room C",
    yaml: "",
  },
  
  // Task 7: Feature Prioritization
  {
    id: "task-7",
    title: "Feature Prioritization for Q3",
    content: "Based on feedback from [[UX Research Findings]] and the upcoming launch, we need to prioritize features for Q3 development.\n\nProcess:\n1. Gather all feature requests from product, support, and sales teams\n2. Score based on strategic alignment, customer impact, and effort\n3. Create draft roadmap\n4. Review with leadership team\n\nComplete before [[Post-Launch Review]] so we can discuss next steps.",
    createdAt: createDate(-5),
    updatedAt: createDate(-3),
    tags: ["product", "planning", "roadmap"],
    done: false,
    yaml: "",
  },
  
  // Mail 4: Customer Beta Feedback
  {
    id: "mail-4",
    title: "Customer Beta Feedback Summary",
    content: "Summary of feedback from our beta customers:\n\nFrom: Product Manager\nTo: Product Team\n\nTeam,\n\nI've compiled feedback from our beta testers and have some insights to share:\n\n- Overall satisfaction score: 8.7/10\n- Most loved feature: The new dashboard\n- Most requested improvement: Faster report generation\n- 92% would recommend to colleagues\n\nThis data should influence our [[Feature Prioritization for Q3]] and be addressed in the [[Post-Launch Review]].\n\nDetailed feedback is available in the shared folder.\n\nRegards,\nProduct Manager",
    createdAt: createDate(-10),
    updatedAt: createDate(-10),
    tags: ["feedback", "beta", "customers"],
    from: "product.manager@company.com",
    to: ["product.team@company.com", "design.team@company.com"],
    yaml: "",
  },
  
  // Task 8: Documentation Update
  {
    id: "task-8",
    title: "Update Technical Documentation",
    content: "Update all technical documentation with the new features and changes.\n\nDocuments to update:\n- API reference\n- Developer guide\n- Integration examples\n- System architecture diagram\n\nThis is a critical task for the [[Product Launch Tasks]] list.",
    createdAt: createDate(-20),
    updatedAt: createDate(-15),
    tags: ["documentation", "technical", "product-launch"],
    done: true,
    yaml: "",
  }
];

// Process all items to ensure they have proper YAML
export const processedExampleItems = exampleContentItems.map(item => {
  return {
    ...item,
    yaml: generateYaml(item)
  };
});
