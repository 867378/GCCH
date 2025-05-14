import { createRouter, createWebHistory } from "vue-router";
import Loginpage from "@/views/Loginpage.vue";
import CompanyDashboard from "@/views/CompanyDashboard.vue";
import CompanyPost from "@/views/CompanyPost.vue";
import CompanyMessage from "@/views/CompanyMessage.vue";
import CompanyApplication from "@/views/CompanyApplication.vue";
import CompanyProfile from "@/views/CompanyProfile.vue";
import Applicantdash from "@/views/Applicantdash.vue";
import Applicantmessage from "@/views/Applicantmessage.vue";
import Applicantprofile from "@/views/Applicantprofile.vue";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "login",
      component: Loginpage,
    },

    {
      path: "/companydash",
      name: "companydash",
      component: CompanyDashboard,
    },

    {
      path: "/companypost",
      name: "companypost",
      component: CompanyPost,
    },

    {
      path: "/companymessage",
      name: "companymessage",
      component: CompanyMessage,
    },

    {
      path: "/companyapplication",
      name: "companyapplication",
      component: CompanyApplication,
    },

   {
      path: "/CompanyProfile",
      name: "CompanyProfile",
      component: CompanyProfile,
    },

    {
      path: "/Applicantdash",
      name: "Applicantdash",
      component: Applicantdash,
    },

    {
      path: "/Applicantmessage",
      name: "Applicantmessage",
      component: Applicantmessage,
    },

    {
      path: "/Applicantprofile",
      name: "Applicantprofile",
      component: Applicantprofile,
    },
  ],
});

export default router;
