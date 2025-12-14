// import { Header } from "@/components/common/header";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

//  import { db } from "@/db";
import SignInForm from "./components/sign-in-form"
import SignUpForm from "./components/sign-up-form"

const AuthenticationPage = async () => {
  // const categories = await db.query.categoryTable.findMany();
  
  return (
    <>
 <div className="flex flex-col min-h-screen">
  {/* <Header categories={categories} /> */}
  <main className="flex flex-1 items-center justify-center w-full p-5">
    <div className="w-full max-w-md flex flex-col items-center">
      <Tabs defaultValue="sign-in" className="w-full">
        <TabsList className="grid grid-cols-2 gap-4 mb-6 w-full">
          <TabsTrigger value="sign-in">Entrar</TabsTrigger>
          <TabsTrigger value="sign-up">Criar Conta</TabsTrigger>
        </TabsList>
        <TabsContent value="sign-in">
          <SignInForm />
        </TabsContent>
        <TabsContent value="sign-up">
          <SignUpForm />
        </TabsContent>
      </Tabs>
    </div>
  </main>
</div>





    
    </>
  )
};
export default AuthenticationPage;