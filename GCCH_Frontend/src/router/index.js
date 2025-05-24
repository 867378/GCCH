import { createRouter, createWebHistory } from "vue-router";
import Loginpage from "@/views/Loginpage.vue";
import Signup from "@/views/Signup.vue";
import CompanyDashboard from "@/views/CompanyDashboard.vue";
import CompanyPost from "@/views/CompanyPost.vue";
import CompanyAccepted from "@/views/CompanyAccepted.vue";
import CompanyMessage from "@/views/CompanyMessage.vue";
import CompanyProfile from "@/views/CompanyProfile.vue";
import Applicantdash from "@/views/Applicantdash.vue";
import Applicantmessage from "@/views/Applicantmessage.vue";
import Applicantprofile from "@/views/Applicantprofile.vue";
import Application from "@/views/Application.vue";
import Redirecting from "@/views/Redirecting.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "Login",
      component: Loginpage,
    },

    {
      path: `/signup/:userId`,
      name: "Signup",
      component: Signup,
    },

    {
      path: "/companydash",
      name: "CompanyDash",
      component: CompanyDashboard,
    },

    {
      path: "/companypost",
      name: "CompanyPost",
      component: CompanyPost,
    },

    {
      path: "/companymessage",
      name: "CompanyMessage",
      component: CompanyMessage,
    },

    {
      path: "/companyaccepted",
      name: "CompanyAccepted",
      component: CompanyAccepted,
    },
    {
      path: "/companyprofile",
      name: "CompanyProfile",
      component: CompanyProfile,
    },

    {
      path: "/applicantdash",
      name: "ApplicantDash",
      component: Applicantdash,
    },

    {
      path: "/applicantmessage",
      name: "ApplicantMessage",
      component: Applicantmessage,
    },

    {
      path: "/applicantprofile",
      name: "ApplicantProfile",
      component: Applicantprofile,
    },
    
    {
      path: "/application",
      name: "Application",
      component: Application,
    },

    {
      path: "/redirecting",
      name: "Redirecting",
      component: Redirecting,
    }
  ],
});

export default router;
