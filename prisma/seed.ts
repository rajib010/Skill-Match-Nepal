import { prisma } from "@/database/prisma";
import { auth } from "../src/lib/auth/server";
import { Flag, PriorityLevel, TimeSlot } from "@prisma/client";

async function main() {
  console.log("🌱 Starting database seeding...");

  // 1. Clean existing data
  await prisma.dCR_Customer.deleteMany();
  await prisma.dCR_Slot.deleteMany();
  await prisma.dCR.deleteMany();
  await prisma.supportTicket.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.centerPersonnel.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  await prisma.center.deleteMany();
  console.log("✅ Existing data cleaned");

  // 2. Create centers
  const center1 = await prisma.center.create({
    data: {
      centerName: "Healing Minds Center",
      contactPhone: "9800000001",
      address: "Thamel, Kathmandu, Nepal",
    },
  });
  const center2 = await prisma.center.create({
    data: {
      centerName: "Wellness Hub Center",
      contactPhone: "9800000002",
      address: "Patan Dhoka, Lalitpur, Nepal",
    },
  });
  const center3 = await prisma.center.create({
    data: {
      centerName: "Mind Care Center",
      contactPhone: "9800000003",
      address: "Boudha, Kathmandu, Nepal",
    },
  });
  console.log("✅ Centers created successfully");

  // 3. Create admin
  const adminUser = await auth.api.createUser({
    body: {
      email: "admin@hone.com",
      name: "Admin User",
      password: "SuperAdmin@123",
      role: "admin",
    },
  });

  await prisma.user.update({
    where: { email: adminUser.user.email },
    data: {
      emailVerified: true,
    },
  });

  // 4. Create center owners
  const centerOwnerData = [
    {
      name: "Rajesh Sharma",
      email: "rajesh.owner@hone.com",
      centerId: center1.id,
    },
    {
      name: "Sita Patel",
      email: "sita.owner@hone.com",
      centerId: center2.id,
    },
    {
      name: "Krishna Karki",
      email: "krishna.owner@hone.com",
      centerId: center3.id,
    },
  ];

  const centerOwners = [];
  for (const ownerData of centerOwnerData) {
    const ownerUser = await auth.api.createUser({
      body: {
        name: ownerData.name,
        email: ownerData.email,
        password: "Owner@123",
        role: "centerOwner",
      },
    });

    await prisma.user.update({
      where: {
        id: ownerUser.user.id,
      },
      data: {
        emailVerified: true,
      },
    });

    await prisma.centerPersonnel.create({
      data: { userId: ownerUser.user.id, centerId: ownerData.centerId },
    });

    centerOwners.push({ ...ownerUser.user, centerId: ownerData.centerId });
  }

  // 5. Create teachers
  const teacherData = [
    {
      name: "Dr. Priya Thapa",
      email: "priya.teacher@hone.com",
      centerId: center1.id,
    },
    {
      name: "Amit Gurung",
      email: "amit.teacher@hone.com",
      centerId: center1.id,
    },
    {
      name: "Dr. Sunita Rai",
      email: "sunita.teacher@hone.com",
      centerId: center2.id,
    },
    {
      name: "Binod Shrestha",
      email: "binod.teacher@hone.com",
      centerId: center2.id,
    },
    {
      name: "Maya Tamang",
      email: "maya.teacher@hone.com",
      centerId: center3.id,
    },
    {
      name: "Deepak Rana",
      email: "deepak.teacher@hone.com",
      centerId: center3.id,
    },
  ];

  const teachers = [];
  for (const teacher of teacherData) {
    const teacherUser = await auth.api.createUser({
      body: {
        name: teacher.name,
        email: teacher.email,
        password: "Teacher@123",
        role: "teacher",
      },
    });

    await prisma.user.update({
      where: { id: teacherUser.user.id },
      data: { emailVerified: true },
    });

    const personnel = await prisma.centerPersonnel.create({
      data: { userId: teacherUser.user.id, centerId: teacher.centerId },
    });

    teachers.push({
      ...teacherUser.user,
      centerId: teacher.centerId,
      personnelId: personnel.id,
    });
  }
  console.log("✅ Teacher users created successfully");

  // 6. Create customers
  const customerData = [
    {
      name: "Ram Bahadur",
      email: "ram.customer@gmail.com",
      address: "Baneshwor, Kathmandu",
      age: 25,
      contactNumber: "9841000001",
      centerId: center1.id,
    },
    {
      name: "Gita Devi",
      email: "gita.customer@gmail.com",
      address: "Jawalakhel, Lalitpur",
      age: 32,
      contactNumber: "9841000002",
      centerId: center2.id,
    },
    {
      name: "Krishna Magar",
      email: "krishna.customer@gmail.com",
      address: "Balaju, Kathmandu",
      age: 28,
      contactNumber: "9841000003",
      centerId: center1.id,
    },
    {
      name: "Sarita Adhikari",
      email: "sarita.customer@gmail.com",
      address: "Bhaktapur Durbar Square",
      age: 35,
      contactNumber: "9841000004",
      centerId: center3.id,
    },
    {
      name: "Dipesh Lama",
      email: "dipesh.customer@gmail.com",
      address: "Kirtipur, Kathmandu",
      age: 24,
      contactNumber: "9841000005",
      centerId: center2.id,
    },
    {
      name: "Anita Shrestha",
      email: "anita.customer@gmail.com",
      address: "New Road, Kathmandu",
      age: 29,
      contactNumber: "9841000006",
      centerId: center1.id,
    },
    {
      name: "Bijay Tamang",
      email: "bijay.customer@gmail.com",
      address: "Sankhamul, Kathmandu",
      age: 31,
      contactNumber: "9841000007",
      centerId: center3.id,
    },
    {
      name: "Kopila Thapa",
      email: "kopila.customer@gmail.com",
      address: "Gongabu, Kathmandu",
      age: 27,
      contactNumber: "9841000008",
      centerId: center2.id,
    },
    {
      name: "Sandip Bhandari",
      email: "sandip.customer@gmail.com",
      address: "Lazimpat, Kathmandu",
      age: 30,
      contactNumber: "9841000009",
      centerId: center1.id,
    },
    {
      name: "Rachana Koju",
      email: "rachana.customer@gmail.com",
      address: "Patan, Lalitpur",
      age: 26,
      contactNumber: "9841000010",
      centerId: center2.id,
    },
  ];

  const customers = [];
  for (let i = 0; i < customerData.length; i++) {
    const data = customerData[i];

    const customerUser = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        emailVerified: false,
        role: "customer",
      },
    });

    const customer = await prisma.customer.create({
      data: {
        userId: customerUser.id,
        centerId: data.centerId,
        address: data.address,
        age: data.age,
        contactNumber: data.contactNumber,
        isInteresting: i % 3 === 0,
      },
    });

    customers.push(customer);
  }
  console.log("✅ Customer users created successfully");

  // 7. Get all center personnel for DCR slots
  const allPersonnel = await prisma.centerPersonnel.findMany({
    include: { user: true },
  });
  console.log(
    `📋 Found ${allPersonnel.length} center personnel for assignments`
  );

  // 8. Create DCRs (100 entries)
  console.log("📅 Creating DCRs...");
  const createdDCRs = [];
  const centers = [center1, center2, center3];

  for (let i = 0; i < 100; i++) {
    const center = centers[i % centers.length];
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const dcr = await prisma.dCR.create({
      data: {
        centerId: center.id,
        date,
        weather:
          ["Sunny", "Cloudy", "Rainy", "Windy"][i % 4] + " with clear skies",
        morningMeeting: `Morning briefing for ${center.centerName} on day ${i}`,
        eveningMeeting: `Evening review for ${center.centerName} on day ${i}`,
        rumor:
          i % 5 === 0 ? `Potential expansion discussion on day ${i}` : null,
        returned: Math.floor(Math.random() * 5),
        bsCall: Math.floor(Math.random() * 10),
      },
    });

    createdDCRs.push(dcr);
  }
  console.log("✅ 100 DCRs created successfully");

  // 9. Create DCR Slots (100 per DCR with proper teacher assignment)
  console.log("⏰ Creating DCR slots...");
  const slotTimes = Object.values(TimeSlot);
  const topics = [
    "Individual Therapy",
    "Group Therapy",
    "Meditation",
    "CBT",
    "Family Counseling",
    "Stress Management",
    "Anxiety Support",
    "Depression Recovery",
    "Art Therapy",
    "Music Therapy",
  ];

  let totalSlots = 0;
  for (const dcr of createdDCRs) {
    const centerPersonnel = allPersonnel.filter(
      (p) => p.centerId === dcr.centerId
    );

    if (centerPersonnel.length === 0) {
      console.warn(`⚠️  No personnel found for center ${dcr.centerId}`);
      continue;
    }

    for (let i = 0; i < 100; i++) {
      const personnel = centerPersonnel[i % centerPersonnel.length];
      const slot = slotTimes[i % slotTimes.length];
      const topic = topics[i % topics.length];

      await prisma.dCR_Slot.create({
        data: {
          dcrId: dcr.id,
          timeSlot: slot,
          waiting: Math.floor(Math.random() * 8) + 1,
          inTherapy: Math.floor(Math.random() * 6) + 1,
          booking: Math.floor(Math.random() * 10) + 2,
          topic,
          teacherId: personnel.id,
          newCustomers: Math.floor(Math.random() * 4),
          couples: Math.floor(Math.random() * 3),
          tenDays: Math.floor(Math.random() * 5) + 1,
          afterEvent: Math.floor(Math.random() * 3),
        },
      });
      totalSlots++;
    }
  }
  console.log(`✅ ${totalSlots} DCR slots created successfully`);

  // 10. Create support tickets with varied dates
  console.log("🎫 Creating support tickets...");
  const initialRemarks = [
    "Initial consultation completed. Patient shows good engagement.",
    "Good progress observed in recent sessions. Continue current approach.",
    "Missed last appointment. Need to follow up urgently.",
    "Family session recommended for better support system.",
    "Medication adjustment needed. Consult with psychiatrist.",
    "Group therapy recommended for social anxiety management.",
    "Patient responding well to CBT techniques.",
    "Need to address work-related stress in next session.",
    "Positive improvement in sleep patterns reported.",
    "Requires additional sessions for trauma processing.",
  ];

  const additionalRemarks = [
    "Follow-up call completed. Patient confirmed next appointment.",
    "Discussed treatment goals and progress milestones.",
    "Patient reported improvement in symptoms.",
    "Scheduling conflict resolved. New appointment set.",
    "Emergency session conducted due to crisis situation.",
  ];

  const priorities = [
    PriorityLevel.HIGH,
    PriorityLevel.MEDIUM,
    PriorityLevel.LOW,
  ];

  let totalTickets = 0;
  for (let i = 0; i < customers.length; i++) {
    const customer = customers[i];

    const ticketCount = Math.floor(Math.random() * 3) + 1;

    for (let j = 0; j < ticketCount; j++) {
      const isResolved = Math.random() > 0.6;
      const hasFollowUp = !isResolved && Math.random() > 0.3;

      const followUpDate = hasFollowUp ? new Date() : null;
      if (followUpDate) {
        const isOverdue = Math.random() > 0.7;
        if (isOverdue) {
          followUpDate.setDate(
            followUpDate.getDate() - Math.floor(Math.random() * 7) - 1
          );
        } else {
          followUpDate.setDate(
            followUpDate.getDate() + Math.floor(Math.random() * 21) + 1
          );
        }
        followUpDate.setHours(0, 0, 0, 0);
      }

      const remarksArray: string[] = [
        initialRemarks[(i + j) % initialRemarks.length],
      ];

      const additionalRemarksCount = Math.floor(Math.random() * 3);
      for (let k = 0; k < additionalRemarksCount; k++) {
        remarksArray.push(
          additionalRemarks[(i + j + k) % additionalRemarks.length]
        );
      }

      const resolvedDate = isResolved ? new Date() : null;
      if (resolvedDate) {
        resolvedDate.setDate(
          resolvedDate.getDate() - Math.floor(Math.random() * 14)
        );
        resolvedDate.setHours(0, 0, 0, 0);
      }

      await prisma.supportTicket.create({
        data: {
          customerId: customer.id,
          initialRemark: initialRemarks[(i + j) % initialRemarks.length],
          followUpAt: followUpDate,
          priority: priorities[(i + j) % priorities.length],
          remarks: remarksArray,
          resolvedAt: resolvedDate,
          resolvedMessage: isResolved
            ? `Issue resolved through ${
                j + 3
              } counseling sessions. Patient shows significant improvement.`
            : null,
        },
      });
      totalTickets++;
    }
  }
  console.log(`✅ ${totalTickets} support tickets created successfully`);

  // 11. Create flagged DCR customers
  console.log("🚩 Creating flagged DCR customers...");
  let flaggedCount = 0;
  for (let i = 0; i < Math.min(50, createdDCRs.length); i++) {
    const dcr = createdDCRs[i];
    const customer = customers[i % customers.length];

    await prisma.dCR_Customer.create({
      data: {
        dcrId: dcr.id,
        customerId: customer.id,
        flag: i % 2 === 0 ? Flag.INTERESTING : Flag.TESTIMONIAL,
        message:
          i % 2 === 0
            ? "Customer showed exceptional progress in therapy."
            : "Willing to provide testimonial for our services.",
      },
    });
    flaggedCount++;
  }
  console.log(`✅ ${flaggedCount} flagged customers created`);

  // 12. Verify final results
  console.log("\n🔍 Verifying results...");
  const finalUserCount = await prisma.user.count();
  const adminCount = await prisma.user.count({ where: { role: "admin" } });
  const ownerCount = await prisma.user.count({
    where: { role: "centerOwner" },
  });
  const teacherCount = await prisma.user.count({
    where: { role: "teacher" },
  });
  const customerCount = await prisma.user.count({
    where: { role: "customer" },
  });
  const dcrCount = await prisma.dCR.count();
  const slotCount = await prisma.dCR_Slot.count();
  const supportTicketCount = await prisma.supportTicket.count();
  const flaggedCustomerCount = await prisma.dCR_Customer.count();

  console.log("\n🎉 Database seeding completed successfully!");
  console.log("\n📋 Summary:");
  console.log(`- Centers: 3`);
  console.log(`- Total Users: ${finalUserCount}`);
  console.log(`  - Admin Users: ${adminCount}`);
  console.log(`  - Center Owners: ${ownerCount}`);
  console.log(`  - Teachers: ${teacherCount}`);
  console.log(`  - Customers: ${customerCount}`);
  console.log(`- DCRs: ${dcrCount}`);
  console.log(`- DCR Slots: ${slotCount}`);
  console.log(`- Support Tickets: ${supportTicketCount}`);
  console.log(`- Flagged Customers: ${flaggedCustomerCount}`);

  console.log("\n🔑 Login Credentials (Ready to use!):");
  console.log("👑 Admin: admin@hone.com / SuperAdmin@123");
  console.log("🏢 Center Owner 1: rajesh.owner@hone.com / Owner@123");
  console.log("🏢 Center Owner 2: sita.owner@hone.com / Owner@123");
  console.log("🏢 Center Owner 3: krishna.owner@hone.com / Owner@123");
  console.log("👨‍🏫 Teacher 1: priya.teacher@hone.com / Teacher@123");
  console.log("👨‍🏫 Teacher 2: amit.teacher@hone.com / Teacher@123");
  console.log("👨‍🏫 Teacher 3: sunita.teacher@hone.com / Teacher@123");
  console.log("👨‍🏫 Teacher 4: binod.teacher@hone.com / Teacher@123");
  console.log("👨‍🏫 Teacher 5: maya.teacher@hone.com / Teacher@123");
  console.log("👨‍🏫 Teacher 6: deepak.teacher@hone.com / Teacher@123");
  console.log(
    "\n📝 Note: Customer accounts are created in the database but need to sign up through the app to set passwords."
  );
  console.log(
    "✅ All staff users can sign in immediately with these credentials!"
  );
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
