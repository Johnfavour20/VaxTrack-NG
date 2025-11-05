import { Infant, EducationalContent, Notification } from './types';

export const INFANTS_DATA: Infant[] = [
  {
    id: 1,
    name: 'Emma Johnson',
    dateOfBirth: '2024-02-15',
    gender: 'Female',
    avatar: '👶',
    parentName: 'Sarah Johnson',
    phoneNumber: '08012345678',
    vaccinations: [
      { name: 'BCG', date: '2024-02-15', status: 'completed', nextDue: null },
      { name: 'Hepatitis B (1st dose)', date: '2024-02-15', status: 'completed', nextDue: null },
      { name: 'OPV (1st dose)', date: '2024-04-15', status: 'completed', nextDue: null },
      { name: 'Pentavalent (1st dose)', date: '2024-04-15', status: 'completed', nextDue: null },
      { name: 'PCV (1st dose)', date: '2024-04-15', status: 'completed', nextDue: null },
      { name: 'OPV (2nd dose)', date: null, status: 'due', nextDue: '2024-06-15' },
      { name: 'Pentavalent (2nd dose)', date: null, status: 'due', nextDue: '2024-06-15' },
    ],
    completionRate: 71
  },
  {
    id: 2,
    name: 'Michael Brown',
    dateOfBirth: '2024-01-10',
    gender: 'Male',
    avatar: '👶',
    parentName: 'David Brown',
    phoneNumber: '08098765432',
    vaccinations: [
      { name: 'BCG', date: '2024-01-10', status: 'completed', nextDue: null },
      { name: 'Hepatitis B (1st dose)', date: '2024-01-10', status: 'completed', nextDue: null },
      { name: 'OPV (1st dose)', date: '2024-03-10', status: 'completed', nextDue: null },
      { name: 'Pentavalent (1st dose)', date: '2024-03-10', status: 'completed', nextDue: null },
      { name: 'OPV (2nd dose)', date: null, status: 'overdue', nextDue: '2024-05-10' },
      { name: 'Measles (1st dose)', date: null, status: 'due', nextDue: '2024-10-10' },
    ],
    completionRate: 66
  },
  {
    id: 3,
    name: 'Chloe Davis',
    dateOfBirth: '2023-12-20',
    gender: 'Female',
    avatar: '👧',
    parentName: 'Linda Davis',
    phoneNumber: '07033445566',
    vaccinations: [
      { name: 'BCG', date: '2023-12-20', status: 'completed', nextDue: null },
      { name: 'Hepatitis B (1st dose)', date: '2023-12-20', status: 'completed', nextDue: null },
      { name: 'OPV (1st dose)', date: '2024-02-20', status: 'completed', nextDue: null },
      { name: 'Pentavalent (1st dose)', date: '2024-02-20', status: 'completed', nextDue: null },
      { name: 'OPV (2nd dose)', date: '2024-04-20', status: 'completed', nextDue: null },
      { name: 'Pentavalent (2nd dose)', date: '2024-04-20', status: 'completed', nextDue: null },
      { name: 'OPV (3rd dose)', date: '2024-06-20', status: 'completed', nextDue: null },
      { name: 'Pentavalent (3rd dose)', date: '2024-06-20', status: 'completed', nextDue: null },
    ],
    completionRate: 100
  },
  {
    id: 4,
    name: 'Olivia Smith',
    dateOfBirth: '2023-08-01',
    gender: 'Female',
    avatar: '👧',
    parentName: 'Sarah Johnson',
    phoneNumber: '08012345678',
    vaccinations: [
      { name: 'BCG', date: '2023-08-01', status: 'completed', nextDue: null },
      { name: 'Hepatitis B (1st dose)', date: '2023-08-01', status: 'completed', nextDue: null },
      { name: 'OPV (1st dose)', date: '2023-09-12', status: 'completed', nextDue: null },
      { name: 'Pentavalent (1st dose)', date: '2023-09-12', status: 'completed', nextDue: null },
      { name: 'PCV (1st dose)', date: '2023-09-12', status: 'completed', nextDue: null },
      { name: 'OPV (2nd dose)', date: '2023-10-10', status: 'completed', nextDue: null },
      { name: 'Pentavalent (2nd dose)', date: '2023-10-10', status: 'completed', nextDue: null },
      { name: 'PCV (2nd dose)', date: '2023-10-10', status: 'completed', nextDue: null },
      { name: 'OPV (3rd dose)', date: '2023-11-07', status: 'completed', nextDue: null },
      { name: 'Pentavalent (3rd dose)', date: '2023-11-07', status: 'completed', nextDue: null },
      { name: 'PCV (3rd dose)', date: '2023-11-07', status: 'completed', nextDue: null },
      { name: 'IPV', date: '2023-11-07', status: 'completed', nextDue: null },
      { name: 'Measles (1st dose)', date: null, status: 'overdue', nextDue: '2024-05-01' },
      { name: 'Yellow Fever', date: null, status: 'overdue', nextDue: '2024-05-01' },
    ],
    completionRate: 86
  },
  {
    id: 5,
    name: 'Noah Williams',
    dateOfBirth: '2024-06-20',
    gender: 'Male',
    avatar: '👶',
    parentName: 'Sarah Johnson',
    phoneNumber: '08012345678',
    vaccinations: [
      { name: 'BCG', date: '2024-06-20', status: 'completed', nextDue: null },
      { name: 'Hepatitis B (1st dose)', date: '2024-06-20', status: 'completed', nextDue: null },
      { name: 'OPV (1st dose)', date: null, status: 'due', nextDue: '2024-08-01' },
      { name: 'Pentavalent (1st dose)', date: null, status: 'due', nextDue: '2024-08-01' },
      { name: 'PCV (1st dose)', date: null, status: 'due', nextDue: '2024-08-01' },
      { name: 'OPV (2nd dose)', date: null, status: 'due', nextDue: '2024-08-29' },
      { name: 'Pentavalent (2nd dose)', date: null, status: 'due', nextDue: '2024-08-29' },
      { name: 'PCV (2nd dose)', date: null, status: 'due', nextDue: '2024-08-29' },
      { name: 'OPV (3rd dose)', date: null, status: 'due', nextDue: '2024-09-26' },
      { name: 'Pentavalent (3rd dose)', date: null, status: 'due', nextDue: '2024-09-26' },
      { name: 'PCV (3rd dose)', date: null, status: 'due', nextDue: '2024-09-26' },
      { name: 'IPV', date: null, status: 'due', nextDue: '2024-09-26' },
      { name: 'Measles (1st dose)', date: null, status: 'due', nextDue: '2025-03-20' },
      { name: 'Yellow Fever', date: null, status: 'due', nextDue: '2025-03-20' },
    ],
    completionRate: 14
  }
];

export const EDUCATIONAL_CONTENT_DATA: EducationalContent[] = [
  {
    id: 1,
    title: 'Understanding Infant Vaccines',
    content: `Vaccines are one of the most important tools we have to protect children from serious and sometimes deadly diseases. They are safe, effective, and a cornerstone of public health in Nigeria and around the world.
    
    **Why Vaccinate?**
    A child's immune system is still developing, making them more vulnerable to infections. Vaccines work by introducing a tiny, safe, and inactive part of a germ (like a virus or bacteria) into the body. This is enough for the immune system to learn how to recognize and build defenses against the real germ without causing the illness. It's like a training exercise for the body's defense forces. When the child is later exposed to the actual disease, their immune system is already prepared to fight it off quickly and effectively.
    
    **Community Immunity (Herd Immunity)**
    When a high percentage of the population is vaccinated, it becomes difficult for diseases to spread. This concept, known as community immunity, helps protect the most vulnerable members of our society who may not be able to get vaccinated, such as newborns, the elderly, or people with weakened immune systems.
    
    **Key Takeaways**
    - Vaccines train your baby's immune system to fight diseases.
    - They are safe and do not cause the diseases they prevent.
    - Following the national immunization schedule is crucial for protection.
    - High vaccination rates protect the entire community.`,
    category: 'Basic Information',
    readTime: '5 min read',
    keyPoints: [
      "How vaccines safely train the immune system.",
      "The concept of community (herd) immunity.",
      "Why following the schedule is crucial for protection."
    ]
  },
  {
    id: 2,
    title: 'Common Vaccine Side Effects',
    content: `It's normal for parents to worry about how their baby will feel after a vaccination. The good news is that most side effects are mild, temporary, and a sign that your baby's immune system is responding and building protection.
    
    **What to Expect After a Shot**
    Common reactions usually start within a day of the vaccination and last for only a day or two. These can include:
    - **Soreness or Redness:** The area where the shot was given might be sore, red, or slightly swollen.
    - **Mild Fever:** A low-grade fever (less than 38.5°C) is common as the immune system gets to work.
    - **Fussiness or Irritability:** Your baby might be more sleepy or fussier than usual for a short period.
    - **Decreased Appetite:** Some babies may not want to eat as much for a day or so.
    
    **How to Comfort Your Baby**
    You can help your baby feel more comfortable by applying a cool, damp cloth to the sore area. Cuddling, extra feeding, and ensuring they are dressed in light clothing can also help. For fever or pain, you can ask your healthcare provider about the appropriate dose of paracetamol for your child's age and weight.
    
    **When to Call a Doctor**
    Serious side effects are very rare. However, you should contact your healthcare provider if your baby has a very high fever, is crying inconsolably for hours, seems unusually weak or floppy, or if you have any other concerns.
    
    **Key Takeaways**
    - Mild side effects like fever and soreness are normal and temporary.
    - These reactions show the vaccine is working.
    - Simple comfort measures can help your baby feel better.
    - Serious side effects are extremely rare, but always contact a doctor if you are concerned.`,
    category: 'Safety',
    readTime: '3 min read',
    keyPoints: [
      "Normal, mild reactions to expect after a shot.",
      "Simple methods to comfort your baby.",
      "When it's important to contact a healthcare provider."
    ]
  },
  {
    id: 3,
    title: 'The Nigerian Vaccine Schedule Explained',
    content: `Nigeria's National Programme on Immunization (NPI) provides a detailed schedule to ensure every child gets the protection they need at the most effective time. This schedule is designed based on extensive research to protect infants when they are most vulnerable to specific diseases.
    
    **At Birth (Day 1)**
    - **BCG:** Protects against tuberculosis.
    - **OPV 0:** The first dose of the oral polio vaccine.
    - **HBV 1:** The first dose of the Hepatitis B vaccine to prevent liver disease.
    
    **At 6 Weeks**
    - **OPV 1:** Second dose of oral polio vaccine.
    - **Pentavalent 1:** A 5-in-1 vaccine protecting against Diphtheria, Tetanus, Pertussis (whooping cough), Hepatitis B, and Haemophilus influenzae type b (Hib).
    - **PCV 1:** The first dose of the pneumococcal conjugate vaccine, which protects against pneumonia and meningitis.
    
    **At 10 Weeks**
    - **OPV 2:** Third dose of oral polio vaccine.
    - **Pentavalent 2:** Second dose of the 5-in-1 vaccine.
    - **PCV 2:** Second dose of the pneumococcal vaccine.
    
    **At 14 Weeks**
    - **OPV 3:** Fourth dose of oral polio vaccine.
    - **Pentavalent 3:** Third dose of the 5-in-1 vaccine.
    - **PCV 3:** Third dose of the pneumococcal vaccine.
    - **IPV:** Inactivated Polio Vaccine, given as an injection to boost polio protection.
    
    **At 9 Months**
    - **Measles 1:** First dose to protect against measles.
    - **Yellow Fever:** Protects against yellow fever.
    
    **Key Takeaways**
    - The schedule is timed to protect children at their most vulnerable ages.
    - Sticking to the schedule is the best way to ensure full protection.
    - Multiple vaccines are often combined into one shot to reduce discomfort.
    - If you miss a dose, speak to your healthcare provider about a catch-up plan.`,
    category: 'Scheduling',
    readTime: '7 min read',
    keyPoints: [
      "Which vaccines are given at birth, 6, 10, and 14 weeks.",
      "The purpose of combination vaccines like Pentavalent.",
      "The importance of the 9-month measles and yellow fever shots."
    ]
  },
  {
    id: 4,
    title: "Nutrition for Your Baby: First 6 Months",
    content: `Proper nutrition during the first six months of life is critical for a baby's growth and development. The World Health Organization (WHO) recommends exclusive breastfeeding for this entire period.
    
    **Exclusive Breastfeeding**
    Breast milk is the perfect food for newborns and infants. It contains all the nutrients, antibodies, hormones, and antioxidants an infant needs to thrive. It protects babies from common childhood illnesses like diarrhea and pneumonia, the two primary causes of child mortality worldwide.
    
    **Signs Your Baby is Getting Enough Milk**
    - **Wet Diapers:** Expect at least 6-8 wet cloth diapers or 5-6 disposable diapers in 24 hours.
    - **Weight Gain:** Steady weight gain is a key indicator. Your healthcare provider will track this at check-ups.
    - **Contentment:** A baby who is content and satisfied after feedings is likely well-fed.
    
    **Formula Feeding**
    If breastfeeding is not possible, infant formula is a safe alternative. It's important to use a formula that is appropriate for your baby's age and to prepare it exactly as instructed on the packaging to ensure safety and proper nutrition. Always discuss with your healthcare provider before starting or switching formulas.
    
    **Key Takeaways**
    - Exclusive breastfeeding is recommended for the first 6 months.
    - Monitor wet diapers and weight gain to ensure your baby is well-fed.
    - Infant formula is a safe alternative when prepared correctly.
    - Do not introduce solid foods, water, or other liquids before 6 months unless advised by a doctor.`,
    category: "Nutrition",
    readTime: "6 min read",
    keyPoints: [
      "The benefits of exclusive breastfeeding for 6 months.",
      "How to know if your baby is getting enough milk.",
      "Safe practices for formula feeding as an alternative."
    ]
  },
  {
    id: 5,
    title: "Tracking Developmental Milestones",
    content: `A developmental milestone is a skill that a child acquires within a specific time frame. These include physical, social, emotional, cognitive, and communication skills. While every child develops at their own pace, milestones provide a general guideline for what to expect.
    
    **By 2 Months, Most Babies:**
    - Begin to smile at people.
    - Can hold their head up and begin to push up when lying on their tummy.
    - Coo, make gurgling sounds, and turn their head toward sounds.
    
    **By 6 Months, Most Babies:**
    - Know familiar faces and begin to know if someone is a stranger.
    - Roll over in both directions (front to back, back to front).
    - Begin to sit without support.
    - Respond to their own name.
    
    **By 9 Months, Most Babies:**
    - May be afraid of strangers and be clingy with familiar adults.
    - Understand "no".
    - Can pull to a stand and may crawl.
    - Play games like "peek-a-boo".
    
    **When to Talk to Your Doctor**
    If you are concerned about your child's development, or if they are consistently missing milestones, it's important to speak with your healthcare provider. Early intervention is key to helping your child thrive.
    
    **Key Takeaways**
    - Milestones are a guide, and every child develops differently.
    - Tracking milestones helps you understand your child's development.
    - Early intervention is crucial if you have concerns.
    - Celebrate your child's progress, big and small!`,
    category: "Milestones",
    readTime: "8 min read",
    keyPoints: [
      "Key physical and social skills to expect at 2, 6, and 9 months.",
      "The importance of tracking your child's progress.",
      "When to consult a doctor about developmental concerns."
    ]
  },
  {
    id: 6,
    title: "Managing Common Infant Illnesses",
    content: `It can be stressful when your baby is sick. Fortunately, most common infant illnesses can be managed safely at home with guidance from your healthcare provider.
    
    **The Common Cold**
    Infants can get many colds in their first year. Symptoms include a runny nose, sneezing, and coughing.
    - **Management:** Use a saline nasal spray and a suction bulb to clear their nose, especially before feedings. Run a cool-mist humidifier in their room. Ensure they get plenty of rest and fluids (breast milk or formula).
    
    **Diaper Rash**
    This is a common skin irritation in the diaper area.
    - **Management:** Change diapers frequently. Clean the area gently with water and a soft cloth. Allow the area to air dry completely before putting on a new diaper. Apply a thick layer of zinc oxide barrier cream.
    
    **Fever**
    A fever is a sign the body is fighting an infection.
    - **When to Worry:** For a baby under 3 months, any fever of 38°C (100.4°F) or higher is a medical emergency. For older babies, call your doctor for fevers above 39°C (102.2°F), or if the fever is accompanied by other serious symptoms like lethargy, poor feeding, or a rash.
    
    **Key Takeaways**
    - A stuffy nose can be managed with saline and suction.
    - Frequent changes and barrier cream are key for diaper rash.
    - Fever in a newborn (under 3 months) is always an emergency.
    - Always trust your instincts and call a doctor if you are worried.`,
    category: "Safety",
    readTime: "5 min read",
    keyPoints: [
      "How to safely manage your baby's first cold.",
      "Effective strategies for preventing and treating diaper rash.",
      "Understanding when a fever requires immediate medical attention."
    ]
  },
  {
    id: 7,
    title: "Why Does My Baby Cry?",
    content: `Crying is a baby's primary way of communicating their needs. Learning to interpret their cries is a process of trial and error for new parents.
    
    **Common Reasons for Crying:**
    - **Hunger:** This is often the first thing parents think of. Look for hunger cues like rooting or sucking on fists.
    - **Dirty Diaper:** A wet or soiled diaper can be uncomfortable.
    - **Needs Sleep:** Overtired babies often have a hard time settling down.
    - **Wants to be Held:** Babies need a lot of cuddling and physical contact to feel secure.
    - **Pain or Discomfort:** This could be from gas, teething, or an itchy clothing tag.
    
    **Soothing Techniques**
    Dr. Harvey Karp's "5 S's" can be very effective for calming a fussy baby:
    1.  **Swaddling:** A snug wrap that mimics the womb.
    2.  **Side or Stomach Position:** Holding the baby on their side or stomach while they are in your arms.
    3.  **Shushing:** Making a loud, rhythmic "shhh" sound.
    4.  **Swinging:** Gentle, rhythmic motion.
    5.  **Sucking:** A pacifier or finger can be very calming.
    
    **When to Call a Doctor**
    If your baby's cry sounds unusual (high-pitched or weak), or if they are crying inconsolably for a long period and cannot be soothed, contact your healthcare provider to rule out any medical issues.
    
    **Key Takeaways**
    - Crying is communication, not manipulation.
    - Run through a checklist: hungry? tired? dirty diaper?
    - The "5 S's" are a powerful set of tools for soothing.
    - Trust your intuition; if a cry seems wrong, seek medical advice.`,
    category: "Parenting Tips",
    readTime: "4 min read",
    keyPoints: [
      "The most common reasons babies cry.",
      "Effective soothing techniques known as the '5 S's'.",
      "How to recognize a cry that might signal a problem."
    ]
  }
];

export const NOTIFICATIONS_DATA: Notification[] = [
    { id: 1, message: 'Emma\'s OPV (2nd dose) is due tomorrow', type: 'reminder', urgent: true, time: '2 hours ago' },
    { id: 2, message: 'Michael\'s vaccination is overdue', type: 'alert', urgent: true, time: '1 day ago' },
    { id: 3, message: 'New educational content "The Nigerian Vaccine Schedule Explained" is available', type: 'info', urgent: false, time: '3 days ago' }
];