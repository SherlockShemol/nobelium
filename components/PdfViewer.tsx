interface PdfViewerProps {
  file: string
}

export default function PdfViewer({ file }: PdfViewerProps) {
  return (
    <div className="w-full">
      <div className="flex justify-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900">
        <embed
          src={file}
          type="application/pdf"
          width="100%"
          height="800"
          style={{ border: 'none' }}
          title="PDF Viewer"
        />
      </div>
    </div>
  )
}
