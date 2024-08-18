import { Helmet } from "react-helmet-async";
import Home from "../components/Home";

function HomePage() {
  return (
    <>
      <Helmet>
        <title>Home Page</title>
      </Helmet>
      <Home />
    </>
  );
}

export default HomePage;
