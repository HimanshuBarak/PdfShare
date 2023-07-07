import { useLocation } from "react-router-dom";
import Comments from "../comments/Comments";

function ViewPdf() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const link = queryParams.get("link");
  const fileId = queryParams.get("fileId");
  console.log(fileId);
  return (
    <div className="h-screen">
      <div className="flex  justify-center h-3/4">
        <object data={link} type="application/pdf" className="w-2/3 h-full">
          <p>
            Alternative text - include a link <a href={link}>to the PDF!</a>
          </p>
        </object>

        <hr />
      </div>
      <Comments fileId={fileId} />
    </div>
  );
}

export default ViewPdf;
