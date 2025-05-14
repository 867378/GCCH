import { createRouter, createWebHistory } from "vue-router";
import AboutView from "@/views/AboutView.vue";
import Loginpage from "@/views/Loginpage.vue";
import Creators from "@/views/Creators.vue";
import CompanyDashboard from "@/views/CompanyDashboard.vue";
import CompanyPost from "@/views/CompanyPost.vue";
import CompanyMessage from "@/views/CompanyMessage.vue";
import CompanyApplication from "@/views/CompanyApplication.vue";
import Applicantdash from "@/views/Applicantdash.vue";
import Applicantmessage from "@/views/Applicantmessage.vue";
import Applicantprofile from "@/views/Applicantprofile.vue";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/about",
      name: "about",
      component: AboutView,
    },

    {
      path: "/login",
      name: "login",
      component: Loginpage,
    },

    {
      path: "/creators",
      name: "creators",
      component: Creators,
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
