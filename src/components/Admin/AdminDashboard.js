import React, {useEffect, useState} from 'react'
import { adminMiddleware, getDashboardCounts } from '../../helpers/adminHelper';
import { updateLoader } from '../../helpers/generalHelper';
export const AdminDashboard = () => {

  const [total_customers, setTotalCustomers] = useState(0);
  const [total_products, setTotalProducts] = useState(0);
  const [total_sell, setTotalSell] = useState(0);
  const [total_reviews, setTotalReviews] = useState(0);
  const [updateText, setUpdateText] = useState("Update Now");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isUpdateNowBtnDisabled, setIsUpdateNowBtnDisabled] = useState(false);

  const fetchDashboardCounts = async() => {
    try {
      const response = await getDashboardCounts();
      setTotalCustomers(response.customers)
      setTotalProducts(response.products)
      setTotalSell(parseFloat(response.totalSaleAmount).toFixed(2))
      setLastUpdated(new Date().toLocaleString());
    } catch (error) {
      console.error(error.message);
      throw new Error('Error fetching dashboard counts');
    }
  };

  useEffect(() => {
    updateLoader(true);
    const checkAdmin = async()=>{
        const result = await adminMiddleware();
        if(result)
          updateLoader(false);
    }
    checkAdmin();
    fetchDashboardCounts();
  }, [])

  const updateDashboardCounts = async () => {
    setUpdateText("Updating...")
    setIsUpdateNowBtnDisabled(true)
    await fetchDashboardCounts();
    setIsUpdateNowBtnDisabled(false)
    setUpdateText("Update Now")
    setLastUpdated(new Date().toLocaleString());
  };
  
  return (
    <>
        <div className="content">
          <div className="stats-btn">
            <button onClick={updateDashboardCounts} disabled={isUpdateNowBtnDisabled}>
              <i className="fa fa-refresh"></i>
              {updateText}
            </button>
          </div>
          <p className='text-right'>Last Updated: {lastUpdated}</p>
          <div className="row">
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className="card card-stats">
                <div className="card-body ">
                  <div className="row">
                    <div className="col-5 col-md-4">
                      <div className="icon-big text-center icon-warning">
                        <i className="nc-icon nc-single-02 text-warning"></i>
                      </div>
                    </div>
                    <div className="col-7 col-md-8">
                      <div className="numbers">
                        <p className="card-category">Customers</p>
                        <p className="card-title">{total_customers || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className="card card-stats">
                <div className="card-body ">
                  <div className="row">
                    <div className="col-5 col-md-4">
                      <div className="icon-big text-center icon-warning">
                        <i className="nc-icon nc-box-2 text-success"></i>
                      </div>
                    </div>
                    <div className="col-7 col-md-8">
                      <div className="numbers">
                        <p className="card-category">Products</p>
                        <p className="card-title">{total_products || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className="card card-stats">
                <div className="card-body ">
                  <div className="row">
                    <div className="col-5 col-md-4">
                      <div className="icon-big text-center icon-warning">
                        <i className="nc-icon nc-vector text-danger"></i>
                      </div>
                    </div>
                    <div className="col-7 col-md-8">
                      <div className="numbers">
                        <p className="card-category">Sell</p>
                        <p className="card-title">&#8377;{total_sell || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className="card card-stats">
                <div className="card-body ">
                  <div className="row">
                    <div className="col-5 col-md-4">
                      <div className="icon-big text-center icon-warning">
                        <i className="nc-icon nc-chat-33 text-primary"></i>
                      </div>
                    </div>
                    <div className="col-7 col-md-8">
                      <div className="numbers">
                        <p className="card-category">Reviews</p>
                        <p className="card-title">{total_reviews || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
    </>
  )
}
