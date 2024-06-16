import PropTypes from 'prop-types'

type PageTitleProps = {
    title:string
    description?:string
    style?: React.CSSProperties
    className?: string
}
export default function PageTitle(props: PageTitleProps) {
  return (
    <div className="page-title">
        <h2 style={props.style}> {props.title}</h2>
        <p>{ props.description }</p>
    </div>
  )
}
 
PageTitle.propType = {
  title: PropTypes.string,
  description: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
}
