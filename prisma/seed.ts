// prisma/seed.ts
import { auth } from "@/lib/auth/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // 1. Clean existing data
  console.log("🧹 Cleaning existing data...");
  await prisma.jobApplication.deleteMany();
  await prisma.jobRequirement.deleteMany();
  await prisma.job.deleteMany();
  await prisma.userSkill.deleteMany();
  await prisma.userProfile.deleteMany();
  await prisma.category.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  console.log("✅ Existing data cleaned");

  // 2. Create admin user
  const adminUser = await auth.api.createUser({
    body: {
      email: "admin@skillmatch.com",
      name: "Admin User",
      password: "Admin@123",
      role: "admin",
    },
  });

  await prisma.user.update({
    where: { email: adminUser.user.email },
    data: {
      emailVerified: true,
    },
  });
  console.log("✅ Admin user created");

  // 3. Create 30+ categories
  console.log("📁 Creating categories...");
  const categories = [
    {
      name: "Web Development",
      slug: "web-development",
      description: "Frontend and backend web development jobs",
    },
    {
      name: "Mobile Development",
      slug: "mobile-development",
      description: "iOS and Android development",
    },
    {
      name: "Data Science",
      slug: "data-science",
      description: "Data analysis and machine learning",
    },
    {
      name: "DevOps",
      slug: "devops",
      description: "Infrastructure and deployment",
    },
    {
      name: "UI/UX Design",
      slug: "ui-ux-design",
      description: "User interface and experience design",
    },
    {
      name: "Database Administration",
      slug: "database-admin",
      description: "Database management and optimization",
    },
    {
      name: "Cloud Computing",
      slug: "cloud-computing",
      description: "AWS, Azure, GCP services",
    },
    {
      name: "Cybersecurity",
      slug: "cybersecurity",
      description: "Security and ethical hacking",
    },
    {
      name: "Quality Assurance",
      slug: "quality-assurance",
      description: "Testing and QA roles",
    },
    {
      name: "Project Management",
      slug: "project-management",
      description: "Technical project management",
    },
    {
      name: "Backend Development",
      slug: "backend-development",
      description: "Server-side development",
    },
    {
      name: "Frontend Development",
      slug: "frontend-development",
      description: "Client-side development",
    },
    {
      name: "Full Stack Development",
      slug: "full-stack-development",
      description: "End-to-end development",
    },
    {
      name: "Machine Learning",
      slug: "machine-learning",
      description: "AI and ML engineering",
    },
    {
      name: "Blockchain",
      slug: "blockchain",
      description: "Blockchain and cryptocurrency",
    },
    {
      name: "Game Development",
      slug: "game-development",
      description: "Video game development",
    },
    {
      name: "Embedded Systems",
      slug: "embedded-systems",
      description: "IoT and embedded programming",
    },
    {
      name: "Network Engineering",
      slug: "network-engineering",
      description: "Network infrastructure",
    },
    {
      name: "Technical Writing",
      slug: "technical-writing",
      description: "Documentation and content",
    },
    {
      name: "Business Intelligence",
      slug: "business-intelligence",
      description: "BI and analytics",
    },
    {
      name: "System Administration",
      slug: "system-administration",
      description: "Server and system management",
    },
    {
      name: "Software Architecture",
      slug: "software-architecture",
      description: "System design and architecture",
    },
    {
      name: "API Development",
      slug: "api-development",
      description: "RESTful and GraphQL APIs",
    },
    {
      name: "E-commerce",
      slug: "e-commerce",
      description: "Online shopping platforms",
    },
    {
      name: "CRM Development",
      slug: "crm-development",
      description: "Customer relationship management",
    },
    {
      name: "ERP Systems",
      slug: "erp-systems",
      description: "Enterprise resource planning",
    },
    {
      name: "Salesforce",
      slug: "salesforce",
      description: "Salesforce development and admin",
    },
    {
      name: "WordPress Development",
      slug: "wordpress-development",
      description: "WordPress themes and plugins",
    },
    {
      name: "Digital Marketing Tech",
      slug: "digital-marketing-tech",
      description: "Marketing automation and tools",
    },
    {
      name: "AR/VR Development",
      slug: "ar-vr-development",
      description: "Augmented and virtual reality",
    },
  ];

  const createdCategories = [];
  for (const cat of categories) {
    const category = await prisma.category.create({ data: cat });
    createdCategories.push(category);
  }
  console.log(`✅ ${createdCategories.length} categories created`);

  // 4. Create 30+ regular users with profiles
  console.log("👥 Creating users with profiles...");
  const skills = [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "Python",
    "Java",
    "C++",
    "Angular",
    "Vue.js",
    "Express.js",
    "Django",
    "Flask",
    "Spring Boot",
    "SQL",
    "MongoDB",
    "PostgreSQL",
    "MySQL",
    "Redis",
    "Docker",
    "Kubernetes",
    "AWS",
    "Azure",
    "GCP",
    "Git",
    "HTML",
    "CSS",
    "Tailwind",
    "Bootstrap",
    "REST API",
    "GraphQL",
    "Next.js",
    "Nest.js",
    "FastAPI",
    "Ruby on Rails",
    "PHP",
    "Laravel",
    "Machine Learning",
    "Data Science",
    "TensorFlow",
    "PyTorch",
    "Pandas",
    "NumPy",
    "UI/UX Design",
    "Figma",
    "Adobe XD",
    "Photoshop",
    "Testing",
    "Jest",
    "Cypress",
    "Selenium",
    "CI/CD",
    "Jenkins",
  ];

  const locations = [
    "Kathmandu",
    "Pokhara",
    "Lalitpur",
    "Biratnagar",
    "Bhaktapur",
    "Dharan",
    "Butwal",
    "Hetauda",
    "Janakpur",
    "Nepalgunj",
  ];

  const users = [];
  for (let i = 1; i <= 30; i++) {
    const userPassword = await bcrypt.hash("User@123", 10);
    const numSkills = Math.floor(Math.random() * 8) + 5;
    const selectedSkills: string[] = [];

    while (selectedSkills.length < numSkills) {
      const skill = skills[Math.floor(Math.random() * skills.length)];
      if (!selectedSkills.find((s) => s === skill)) {
        selectedSkills.push(skill);
      }
    }

    const user = await prisma.user.create({
      data: {
        name: `User ${i}`,
        email: `user${i}@example.com`,
        emailVerified: true,
        role: "user",
        accounts: {
          create: {
            id: `user-${i}-account`,
            accountId: `user-${i}-account-id`,
            providerId: "credential",
            password: userPassword,
          },
        },
        profile: {
          create: {
            phone: `98${Math.floor(10000000 + Math.random() * 90000000)}`,
            location: locations[Math.floor(Math.random() * locations.length)],
            bio: `Passionate developer with ${
              Math.floor(Math.random() * 8) + 1
            } years of experience in software development. Strong problem-solving skills and team collaboration.`,
            experience: `${
              Math.floor(Math.random() * 8) + 1
            } years in software development`,
            education: `Bachelor's in Computer Science`,
            cvUrl: `/uploads/cv/user${i}.pdf`,
            cvParsedAt: new Date(),
            skills: {
              create: selectedSkills.map((skill) => {
                const levels = ["beginner", "intermediate", "expert"];
                return {
                  skillName: skill,
                  level: levels[Math.floor(Math.random() * levels.length)],
                };
              }),
            },
          },
        },
      },
      include: {
        profile: {
          include: {
            skills: true,
          },
        },
      },
    });
    users.push(user);
  }
  console.log(`✅ ${users.length} users created with profiles and skills`);

  // 5. Create 50+ jobs
  console.log("💼 Creating jobs...");
  const companies = [
    "Tech Innovations Pvt. Ltd.",
    "Digital Solutions Nepal",
    "CloudNet Systems",
    "DataMinds Corp",
    "WebCraft Studios",
    "NextGen Technologies",
    "Cyber Secure Nepal",
    "AI Ventures",
    "CodeFactory",
    "Smart Solutions",
    "Future Tech",
    "InnovateLab",
    "TechHub Nepal",
    "Digital Dynamics",
    "ByteBuilders",
    "AppMakers Nepal",
    "CloudFirst",
    "DataDriven Co.",
    "SecurityPlus",
    "DesignStudio Nepal",
  ];

  const jobTypes = ["full-time", "part-time", "contract", "internship"];

  const jobTitles = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "React Developer",
    "Node.js Developer",
    "Python Developer",
    "Java Developer",
    "DevOps Engineer",
    "Data Scientist",
    "Machine Learning Engineer",
    "UI/UX Designer",
    "Mobile Developer",
    "Database Administrator",
    "Cloud Architect",
    "Security Engineer",
    "QA Engineer",
    "Project Manager",
    "Software Architect",
    "API Developer",
    "WordPress Developer",
    "Angular Developer",
    "Vue.js Developer",
    "Django Developer",
    "PHP Developer",
    "iOS Developer",
    "Android Developer",
    "Game Developer",
    "Blockchain Developer",
    "AI Engineer",
    "Network Engineer",
    "System Administrator",
    "Technical Writer",
    "BI Analyst",
    "Embedded Systems Engineer",
    "Salesforce Developer",
    "CRM Developer",
    "ERP Specialist",
    "AR/VR Developer",
    "E-commerce Developer",
    "Marketing Tech Specialist",
    "Flutter Developer",
    "React Native Developer",
    "Kubernetes Engineer",
    "ETL Developer",
    "Data Engineer",
    "Site Reliability Engineer",
    "Platform Engineer",
    "Solutions Architect",
    "Integration Specialist",
    "Automation Engineer",
    "Performance Engineer",
  ];

  const jobs = [];
  for (let i = 0; i < 50; i++) {
    const category =
      createdCategories[Math.floor(Math.random() * createdCategories.length)];
    const jobTitle = jobTitles[i % jobTitles.length];

    const numRequirements = Math.floor(Math.random() * 5) + 3;
    const selectedSkills: string[] = [];
    while (selectedSkills.length < numRequirements) {
      const skill = skills[Math.floor(Math.random() * skills.length)];
      if (!selectedSkills.includes(skill)) {
        selectedSkills.push(skill);
      }
    }

    const job = await prisma.job.create({
      data: {
        title: jobTitle,
        description: `We are looking for an experienced ${jobTitle} to join our dynamic team. You will work on cutting-edge projects, collaborate with talented professionals, and have opportunities for growth and learning.`,
        company: companies[Math.floor(Math.random() * companies.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        salary: `Rs. ${Math.floor(Math.random() * 100000) + 30000} - ${
          Math.floor(Math.random() * 150000) + 80000
        }`,
        jobType: jobTypes[Math.floor(Math.random() * jobTypes.length)],
        categoryId: category.id,
        postedById: adminUser.user.id,
        isActive: Math.random() > 0.1,
        expiresAt: new Date(
          Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000
        ),
        requirements: {
          create: selectedSkills.map((skill, index) => ({
            skillName: skill,
            required: index < Math.floor(numRequirements / 2),
          })),
        },
      },
      include: {
        requirements: true,
      },
    });
    jobs.push(job);
  }
  console.log(`✅ ${jobs.length} jobs created with requirements`);

  // 6. Create job applications with match scores
  console.log("📝 Creating job applications...");
  let totalApplications = 0;

  for (const user of users.slice(0, 25)) {
    const numApplications = Math.floor(Math.random() * 5) + 2;
    const appliedJobs = new Set();

    for (let i = 0; i < numApplications; i++) {
      let job;
      do {
        job = jobs[Math.floor(Math.random() * jobs.length)];
      } while (appliedJobs.has(job.id));

      appliedJobs.add(job.id);

      const userSkillNames =
        user.profile?.skills.map((s) => s.skillName.toLowerCase()) || [];
      const jobRequirements = job.requirements;

      let totalWeight = 0;
      let matchedWeight = 0;

      jobRequirements.forEach((req) => {
        const weight = req.required ? 2 : 1;
        totalWeight += weight;

        if (userSkillNames.includes(req.skillName.toLowerCase())) {
          matchedWeight += weight;
        }
      });

      const matchScore =
        totalWeight > 0 ? (matchedWeight / totalWeight) * 100 : 0;

      const statuses = ["pending", "reviewed", "accepted", "rejected"];
      await prisma.jobApplication.create({
        data: {
          jobId: job.id,
          userId: user.id,
          matchScore: Math.round(matchScore * 100) / 100,
          status: statuses[Math.floor(Math.random() * statuses.length)],
          coverLetter: `I am very interested in the ${job.title} position at ${job.company}. With my experience and skills, I believe I would be a great fit for your team.`,
        },
      });
      totalApplications++;
    }
  }
  console.log(`✅ ${totalApplications} job applications created`);

  // 7. Verify final results
  console.log("\n🔍 Verifying results...");
  const finalUserCount = await prisma.user.count();
  const adminCount = await prisma.user.count({ where: { role: "admin" } });
  const regularUserCount = await prisma.user.count({ where: { role: "user" } });
  const categoryCount = await prisma.category.count();
  const jobCount = await prisma.job.count();
  const activeJobCount = await prisma.job.count({ where: { isActive: true } });
  const userProfileCount = await prisma.userProfile.count();
  const userSkillCount = await prisma.userSkill.count();
  const jobRequirementCount = await prisma.jobRequirement.count();
  const applicationCount = await prisma.jobApplication.count();

  console.log("\n🎉 Database seeding completed successfully!");
  console.log("\n📋 Summary:");
  console.log(`- Total Users: ${finalUserCount}`);
  console.log(`  - Admin Users: ${adminCount}`);
  console.log(`  - Regular Users: ${regularUserCount}`);
  console.log(`- Categories: ${categoryCount}`);
  console.log(`- Jobs: ${jobCount} (${activeJobCount} active)`);
  console.log(`- User Profiles: ${userProfileCount}`);
  console.log(`- User Skills: ${userSkillCount}`);
  console.log(`- Job Requirements: ${jobRequirementCount}`);
  console.log(`- Job Applications: ${applicationCount}`);

  console.log("\n🔑 Login Credentials:");
  console.log("👑 Admin: admin@jobportal.com / Admin@123");
  console.log("👤 User 1: user1@example.com / User@123");
  console.log("👤 User 2: user2@example.com / User@123");
  console.log("👤 User 3: user3@example.com / User@123");
  console.log("... (user1 to user30 all use password: User@123)");
  console.log("\n✅ All users can sign in immediately with these credentials!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    console.log("\n🔌 Disconnecting from database...");
    await prisma.$disconnect();
    console.log("✅ Disconnected successfully!");
  });
