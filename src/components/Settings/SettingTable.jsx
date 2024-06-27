import { Pagination } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PopUp from './PopUp';
import UpdatePopUp from './UpdatePopUp'

const SettingTable = ({ target,setShowSetting,name,count,setCount }) => {

  const [page, setPage] = useState(1);
  const [postPerPage, setpostPerPage] = useState(5);
  const lastIndexOfPage = page * postPerPage;
  const firstIndexPage = lastIndexOfPage - postPerPage;
  const currentPage = name === 'LogoAvatar' ? 1 : target.slice(firstIndexPage, lastIndexOfPage);
  const totalPages = target.length;
  const onShowSizeChange = (current, pageSize) => {
    setpostPerPage(pageSize);
  };

  useEffect(() => {
    setPage(1);
  }, [target]);
  const hideModal = () => {
    const modal = document.getElementById("setting-manage");
    window.onclick = (event) => {
      if (event.target == modal) {
         setShowSetting(false);
      }
    };
  };
  return (
    <div
    className="manage-modal"
    id="setting-manage"
    onClick={() => hideModal()}
    >
      <div className={ name  === 'LogoAvatar'?'Avatar-modal':"manage-modal-content"}>
      <div className="modal-title"
      >
           <PopUp count={count} setCount={setCount} title={name} />
        </div>
       
        <table className="data-table">

          <thead>
            <tr>
            <th>ID</th>
            <th> {name == 'LogoAvatar' ? 'Avatar' : 'name'}</th>
            {name == 'LogoAvatar' && <th> Logo </th>}
            <th>Action</th>
            </tr>
          </thead>

          <tbody>
          {name  === 'LogoAvatar' ?  <tr className="active_row">
                            <td>{target.id}</td>
                            <td>{target.avatar}</td>
                            <td>{target.logo}</td>
                            <td>
                                
                                <UpdatePopUp title={name} target={target} />
                                
                            </td>
                           </tr>
                            
                            :currentPage.map((item,index) => (
                        <tr className="active_row" key={index}>
                            <td>{item.id}</td>
                            { name === 'alertType' ?  <td>{item.alertType}</td> :
                            name === 'name'?  <td>{item.name}</td>:
                            name === 'driverStatus'?  <td>{item.driverStatus}</td>:
                            name === 'driverState'?  <td>{item.driverState}</td>:
                            name === 'medium'?  <td>{item.medium}</td>:
                            name === 'conditionName'?  <td>{item.conditionName}</td>:
                            name === 'service'?  <td>{item.service}</td>:
                            name === 'catagory'?  <td>{item.catagory}</td>:
                            name === 'companyType' ?  <td>{item.companyType}</td>:
                            name === 'sectorName'?  <td>{item.sectorName}</td>:
                            name === 'businessType' ?<td> {item.businessType}</td>:
                            name === 'businessSector'?  <td>{item.businessSector}</td>:
                            name === 'triptypes'?  <td>{item.tripType}</td>:
                            name === 'cargoType' ?  <td>{item.cargoType}</td>:
                                    <td>{item.driverState}</td>}
                            
                            <td>
                       
                                  <UpdatePopUp title={name} target={target} id={item.id} />

                           </td>
                                                        
                           </tr>
                                                ))}

          </tbody>
        </table>
        <Pagination
        onChange={(page) => setPage(page)}
        pageSize={postPerPage}
        current={page}
        total={totalPages}
        onShowSizeChange={onShowSizeChange}
      />
      </div>
    
     </div>
     )
 }

export default SettingTable;
