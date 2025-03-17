const PDFViewer = ({ src }) => {
    return (
      <div className="ratio ratio-16x9 border rounded">
        <iframe src={src} title="PDF Viewer" className="w-100 h-100" />
      </div>
    )
  }
  
  export default PDFViewer
  
  