import { Layout, Col } from 'antd';

export const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <Layout.Footer 
      className="w-full p-2!"
    >
      <Col 
        lg={16} 
        xs={24} 
        className="mx-auto text-center text-xs"
      >
        @ {year} <a href="https://www.linkedin.com/in/muhamad-husein" target="_blank" rel="noopener noreferrer">Muhamad Husein</a>

        <div>All Rights Reserved.</div>
      </Col>
    </Layout.Footer>
  );
}
