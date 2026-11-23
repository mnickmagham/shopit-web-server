"use client";
import { clearError, setError, setSuccess, setIsLoggedIn } from "@/store/ui";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { handleSignup } from "../tools/handleSignup";
import { setUser } from "@/store/user";
import Cookies from "js-cookie";
import EyeIcon from "@/svg/eye.svg";
import Image from "next/image";
export const SignUpForm = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const success = useSelector((state: any) => state.ui.success);
  const error = useSelector((state: any) => state.ui.error);

  const handleSignUp = async () => {
    setIsLoading(true);
    const res: any = await handleSignup(email, password);
    if (res.error) {
      dispatch(setError(res.error));
      setIsLoading(false);
      return;
    }
    console.log(res);
    Cookies.set("session", JSON.stringify({ token: res.token }));
    dispatch(setSuccess("کاربر با موفقیت ایجاد شد"));
    dispatch(setIsLoggedIn(true));
    dispatch(setError(""));
    dispatch(setUser(res));
  };

  return (
    <div>
      <div className="font-semibold text-lg mb-10">ثبت نام</div>
      <div className="gap-4 flex flex-col mb-6">
        <div>
          <input
            type="text"
            className="w-full h-16 p-4 border-[#d9d9d9;
] border "
            placeholder="آدرس ایمیل"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex items-center">
          <input
            type={showPassword ? "text" : "password"}
            className="w-full h-16 p-4 border-[#d9d9d9;
] border "
            placeholder="رمز عبور"
            onChange={(e) => setPassword(e.target.value)}
          />
          <div
            className="mr-[-30px]"
            onClick={() => setShowPassword(!showPassword)}
          >
            <Image src={EyeIcon} alt="eye" />
          </div>
        </div>
        {success && <div className="text-green-500">{success}</div>}
        {error && <div className="text-red-500">{error}</div>}
      </div>
      <div className="font-semibold text-gray-400 mb-10">
        اطلاعات شخصی شما برای پردازش سفارش شما استفاده می‌شود، و پشتیبانی از
        تجربه شما در این وبسایت، و برای اهداف دیگری که در
        <span className="text-blue-500">سیاست حفظ حریم خصوصی</span> توضیح داده
        شده است.
      </div>
      <div>
        <button
          className="w-full bg-[#fcb800] h-14 font-semibold text-lg"
          onClick={() => {
            dispatch(clearError());
            handleSignUp();
          }}
        >
          {isLoading ? "در حال ثبت نام..." : "عضویت"}
        </button>
      </div>
    </div>
  );
};
