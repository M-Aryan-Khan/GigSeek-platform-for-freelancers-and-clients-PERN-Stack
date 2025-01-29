import React, { useRef } from "react";
import NavBar from "./NavBar";
import Front from "./Front";
import Category from "./Category";
import Requirements from "./Requirements";
import ClientReviews from "./ClientReviews";
import Footer from "./Footer";

export default function Home() {
  const frontRef = useRef(null);
  const categoryRef = useRef(null);
  const reviewsRef = useRef(null);

  return (
    <div className="bg-[#d6d7dd]">
      <NavBar frontRef={frontRef} categoryRef={categoryRef} reviewsRef={reviewsRef} />
      <div ref={frontRef}>
        <Front />
      </div>
      <div ref={categoryRef}>
        <Category />
      </div>
      <Requirements />
      <div ref={reviewsRef}>
        <ClientReviews />
      </div>
      <Footer/>
    </div>
  );
}
