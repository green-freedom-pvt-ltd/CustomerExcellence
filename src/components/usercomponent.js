import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Pagination } from 'react-bootstrap';


export default class userComponent extends Component {
    render() {
        const { dataobject, runview, pagecount, activepage, handleselect, runcount } = this.props;
        let totalDistance = parseFloat(dataobject.total_distance.total_distance).toFixed(2);
        var email_subject = "Impact Feedback";
        var email_body_content = "Hi ,%0A%0AThis is regarding your feedback .%0A%0A%0AWe value your feedback, let us know if this answered your question.%0A%0AHappy Impacting. Get Fit Do Good.%0A%0AAbhijeet,%0ATeam Impact.%0A%0AIf everyone is moving forward together, success takes care of itself.";
var runurl = "http://dev.impactrun.com/admin/share_api/runs/add/?user_id="+ dataobject.user_id

        return (

            <div className="col-sm-7" >
                <div className="box-top-left" >

                    <div className="col-sm-12">
                        <div style={{ display: "flex", padding: "10px 0px" }}>
                            <div style={{ marginRight: "10px" }}>
                                <img src={dataobject.social_thumb} alt={"social-thumb-" + dataobject.first_name} style={{ width: "80px" }} className="img-circle" />
                            </div>
                            <div>
                                <h4 style={{ margin: "auto" }}>{dataobject.user_id + ' ' + dataobject.first_name + ' ' + dataobject.last_name}</h4>
                                <ul style={{ listStyle: "none", padding: "0px" }}>
                                    <li>Email : <a href={"https://mail.google.com/mail/u/1/?view=cm&fs=1&to=" + dataobject.email + "&su=" + email_subject + "&body=" + email_body_content + "&tf=1"} target="_blank">{dataobject.email}</a></li>
                                    <li>Gender : {dataobject.gender_user}</li>
                                    <li>Weight : {dataobject.body_weight}</li>
                                </ul>
                            </div>
                            <div style={{ marginLeft: "10px" }}>
                                <a className="btn btn-primary" target="_blank" href="https://eu1.dashboard.clevertap.com/654-KWR-584Z/find-people.html">Go to Clevertap</a>
                            </div>
                            <div style={{ marginLeft: "10px" }}>
                                <a className="btn btn-primary" target="_blank" href={runurl}>Add Run</a>
                            </div>
                        </div>
                        <div style={{ display: "flex" }}>
                            <div className="item">
                                <p style={{ color: "rgba(0, 0, 0, 0.37)", fontWeight: "bold" }}>Total Raised</p>
                                <p>&#8377; {dataobject.total_amount.total_amount === null ? 0 : dataobject.total_amount.total_amount}</p>
                            </div>
                            <div className="item">
                                <p style={{ color: "rgba(0, 0, 0, 0.37)", fontWeight: "bold" }}>No. of Runs</p>
                                <p>{runcount}</p>
                            </div>
                            <div className="item">
                                <p style={{ color: "rgba(0, 0, 0, 0.37)", fontWeight: "bold" }}>Distance</p>
                                <p>{totalDistance === "NaN" ? 0 : totalDistance} km</p>
                            </div>
                            <div className="item">
                                <p style={{ color: "rgba(0, 0, 0, 0.37)", fontWeight: "bold" }}>Team Code</p>
                                <p>
                                    <Link to={"/teammembers/" + dataobject.team_code + "/"}>
                                        {dataobject.team_code === null ? "Not in League" : dataobject.team_code}
                                    </Link>
                                </p>
                            </div>
                            <div className="item">
                                <p style={{ color: "rgba(0, 0, 0, 0.37)", fontWeight: "bold" }}>Mobile No.</p>
                                <p>{dataobject.phone_number === "NaN" ? 0 : dataobject.phone_number}</p>
                            </div>
                            <div className="item">
                                <p style={{ color: "rgba(0, 0, 0, 0.37)", fontWeight: "bold" }}>Birthday</p>
                                <p>{dataobject.birthday === "NaN" ? 0 : dataobject.birthday}</p>
                            </div>
                            <div className="item">
                                <a className="btn btn-success" href="#feedback">Feedback</a>
                            </div>

                        </div>


                    </div>
                    <div className="col-sm-2">

                    </div>

                </div>
                <div className="box-top-left" style={{ maxHeight: "540px", overflowY: "auto", overflowX: "hidden" }}>

                    <table className="table table-striped" >
                        <thead>
                            <tr>
                                <th>Start Time</th>
                                <th>Cause</th>
                                <th>Distance / δE / δG</th>
                                <th>Steps / D / δE / δG</th>
                                <th>Calories / δE</th>
                                <th>Run Id</th>
                                <th>Team</th>
                                <th>Duration</th>
                            </tr>
                        </thead>
                        <tbody style={{ color: "rgba(0, 0, 0, 0.37)", fontWeight: "bold", fontSize: "12px" }}>
                            {runview}
                        </tbody>
                    </table>
                    <div style={{ display: pagecount > 1 ? "block" : "none" }} id="pagination">
                        <Pagination
                            prev
                            next
                            first
                            last
                            ellipsis
                            boundaryLinks
                            items={pagecount}
                            maxButtons={3}
                            activePage={activepage}
                            onSelect={handleselect} />
                    </div>

                </div>
            </div>
        );
    }

}

