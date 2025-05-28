import { createRouter, createWebHistory } from "vue-router";
import axios from "axios"; 
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

router.beforeEach(async (to, from, next) => {
  const userId = localStorage.getItem('user_id');
  const publicPages = ['Login', 'Signup', 'Redirecting'];
  const authRequired = !publicPages.includes(to.name);

  let role = localStorage.getItem('user_role');

  if (userId && publicPages.includes(to.name)) {
    if (!role) {
      try {
        const { data } = await axios.get(`/user/${userId}`);
        role = data.role;
        localStorage.setItem('user_role', role);
      } catch (error) {
        console.error('Failed to fetch user role');
        return next({ name: 'Login' });
      }
    }
    const fallback = localStorage.getItem('last_valid_route') || (role === 'company' ? 'CompanyDash' : 'ApplicantDash');
    return next({ name: fallback });
  }

  if (authRequired && !userId) {
    return next({ name: 'Login' });
  }

  if (!authRequired) return next();

  try {
    if (!role) {
      const { data } = await axios.get(`/user/${userId}`);
      role = data.role;
      localStorage.setItem('user_role', role);
    }

    const companyOnlyRoutes = ['CompanyDash', 'CompanyPost', 'CompanyMessage', 'CompanyAccepted', 'CompanyProfile'];
    const applicantOnlyRoutes = ['ApplicantDash', 'ApplicantMessage', 'ApplicantProfile', 'Application'];

    const fallback = from.name || localStorage.getItem('last_valid_route') || 'Login';

    if (companyOnlyRoutes.includes(to.name) && role !== 'company') {
      return next({ name: fallback });
    }

    if (applicantOnlyRoutes.includes(to.name) && role !== 'applicant') {
      return next({ name: fallback });
    }

    return next();
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    return next({ name: 'Login' });
  }
});

router.afterEach((to) => {
  const publicPages = ['Login', 'Signup', 'Redirecting'];
  if (!publicPages.includes(to.name)) {
    localStorage.setItem('last_valid_route', to.name);
  }
});



export default router;
