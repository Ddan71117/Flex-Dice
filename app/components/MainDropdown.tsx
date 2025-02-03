// "use client";
// import { useState, useEffect } from "react";
// import Link from "next/link";
// import AvatarCarousel from "./AvatarCarousel";
// import { signOut } from "../../auth";

// const MainDropdown: React.FC = () => {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null); // Store selected avatar state
//   const [username, setUsername] = useState<string | null>(null);
//   const [userEmail, setUserEmail] = useState<string | null>(null);

//   useEffect(() => {
//     const storedUserEmail = localStorage.getItem("userEmail");
//     if (storedUserEmail) {
//       setUserEmail(storedUserEmail);
//     }
//   }, []);

//   // get username from local storage
//   useEffect(() => {
//     const storedUsername = localStorage.getItem("username");
//     if (storedUsername) {
//       setUsername(storedUsername); // Fix: set the correct username
//     }
//   }, []);

//   // Check if user is logged in on initial load (from localStorage)
//   useEffect(() => {
//     const storedIsLoggedIn = localStorage.getItem("isLoggedIn");
//     const storedAvatar = localStorage.getItem("selectedAvatar");

//     // If the user is logged in, set the corresponding states
//     if (storedIsLoggedIn === "true") {
//       setIsLoggedIn(true); // Update logged-in state
//     }

//     if (storedAvatar) {
//       setSelectedAvatar(storedAvatar); // Update selected avatar
//     }
//   }, []); // This runs only once on initial load

//   // Handle logout
//   const handleLogout = async () => {
//     localStorage.removeItem("isLoggedIn");
//     localStorage.removeItem("selectedAvatar");
//     localStorage.removeItem("username");
//     localStorage.removeItem("userEmail");
//     setIsLoggedIn(false);
//     setSelectedAvatar(null);
//     setUsername(null);
//     setUserEmail(null);
//     await signOut({ callbackUrl: "/" });
//   };

//   // Toggle the dropdown visibility
//   const toggleDropdown = () => {
//     setIsDropdownOpen((prevState) => !prevState);
//   };

//   // Close the dropdown when clicking outside
//   const handleClickOutside = (e: any) => {
//     if (!e.target.closest(".dropdown") && !e.target.closest(".avatar-btn")) {
//       setIsDropdownOpen(false);
//     }
//   };

//   useEffect(() => {
//     document.addEventListener("click", handleClickOutside);
//     return () => {
//       document.removeEventListener("click", handleClickOutside);
//     };
//   }, []);

//   return (
//     <div className="fixed left-1/2 transform -translate-x-1/2 z-40 flex items-center space-x-3">
//       <button
//         type="button"
//         className="avatar-btn flex text-sm bg-gray-800 rounded-full ring-2 ring-red-300 dark:ring-red-500 focus:outline-none hover:ring-4 hover:ring-blue-800"
//         onClick={toggleDropdown}
//       >
//         <span className="sr-only">Open user menu</span>

//         {/* If logged in and avatar selected, show the avatar */}
//         {isLoggedIn && selectedAvatar ? (
//           <img
//             className="w-32 h-32 rounded-full "
//             src={selectedAvatar}
//             alt="User Avatar"
//             width={48}
//             height={48}
//           />
//         ) : (
//           /* Show DiceCluster only if logged out */
//           !isLoggedIn && <div className="w-32 h-32 rounded-full bg-gray-500" />
//         )}
//       </button>

//       {isDropdownOpen && isLoggedIn && (
//         <div className="dropdown absolute left-10 top-16 z-50 mt-2 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700 dark:divide-gray-600">
//           {isLoggedIn ? (
//             <div className="px-4 py-3">
//               <span className="block text-sm text-gray-900 dark:text-white">
//                 {username || "UserNameHere"}
//               </span>
//               <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
//                 {userEmail || "test@gmail.com"}
//               </span>
//             </div>
//           ) : (
//             <ul className="py-2">
//               <li>
//                 <Link
//                   href="/"
//                   className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 dark:text-gray-200 dark:hover:bg-blue-600"
//                 >
//                   Login
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   href="/signup"
//                   className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 dark:text-gray-200 dark:hover:bg-green-600"
//                 >
//                   Signup
//                 </Link>
//               </li>
//             </ul>
//           )}

//           {/* Show logout only when logged in */}
//           {isLoggedIn && (
//             <ul className="py-2">
//               <li>
//                 <Link href="/" passHref>
//                   <button
//                     onClick={handleLogout} // Handle logout
//                     className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
//                   >
//                     Sign out
//                   </button>
//                 </Link>
//               </li>
//             </ul>
//           )}
//         </div>
//       )}

//       {/* Always show AvatarCarousel when logged in and no avatar selected */}
//       {isLoggedIn && !selectedAvatar && (
//         <div className="absolute top-16 left-10 mt-2 z-50">
//           <AvatarCarousel onSelectAvatar={setSelectedAvatar} />
//         </div>
//       )}
//     </div>
//   );
// };

// export default MainDropdown;
