import { login, signup } from "./actions";

export default function AuthPage() {
  return (
    <div className="flex flex-col justify-center items-center w-full h-screen">
      <form className="flex flex-col justify-center items-center gap-y-4">
        <div className="flex flex-col justify-center items-start w-full gap-y-2">
          <label htmlFor="email">Email</label>
          <input
            className="w-full border-2 border-slate-700 rounded-lg px-2"
            id="email"
            name="email"
            type="email"
            required
          />
        </div>
        <div className="flex flex-col justify-center items-start w-full gap-y-2">
          <label htmlFor="password">Password</label>
          <input
            className="w-full border-2 border-slate-700 rounded-lg px-2"
            id="password"
            name="password"
            type="password"
            required
          />
        </div>
        <button
          className="w-full bg-yellow-500 py-2 rounded-lg cursor-pointer hover:bg-yellow-600 text-slate-800"
          formAction={login}
        >
          Log in
        </button>
        <button
          className="w-full rounded-lg cursor-pointer hover:bg-slate-800 py-2"
          formAction={signup}
        >
          Sign up
        </button>
      </form>
    </div>
  );
}
