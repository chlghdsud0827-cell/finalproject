import './PagePlaceholder.css'

function PagePlaceholder({ title, description }) {
  return (
    <main className="page-placeholder">
      <div className="page-placeholder__inner">
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </main>
  )
}

export default PagePlaceholder
