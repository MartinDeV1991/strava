import React, { useState, useEffect } from "react";
import GetAccess from "../components/GetAccess";
import LoadData from "../components/LoadData";
import DisplayActivities from "../components/DisplayActivities";
import DisplayDistancePerMonth from "../components/DisplayDistancePerMonth";
import DistanceChart from "../components/DistanceChart";
import SpeedChart from "../components/SpeedChart";
import Map from "../components/Map";
import Button from 'react-bootstrap/Button';

const HomePage = () => {

    const [accessToken, setAccessToken] = useState();
    const [activities, setActivities] = useState();
    const [distancePerMonth, setDistancePerMonth] = useState();
    const [speedPerMonth, setSpeedPerMonth] = useState();

    const [polylineString, setPolyLineString] = useState("mhm}HiejZ?YKUK[AUQm@Gk@GKE][mACYQm@Cm@KSFk@FWFILBJJBECQU_@MGK?MFMLEBUXIBm@z@Y~@]n@CF@LEHAHM\\ATQXALMNUb@EPGAQVEPEFGZ_@v@a@\\i@NCDI@SXKDk@r@CFCNE@ELE@IZ[^EBEEQSGQIEUDKGc@La@|@EL?JINQVIBEAAFIOGACCQ[MIIAGJCVIJCN[t@MLKREBGTb@^DDDVTZd@^V\\@JHJHTLRd@b@@JLTPNBNJRPHNXb@VNLJPBHHFJLVh@h@n@N`@XLHb@HV?HT\\Nb@JLP\\Vt@^f@LDHKF[Xi@?OX[FQFMJKFQLs@HID[BIDABSLQBi@Zo@Bg@HGAQ?GTODa@V}@?GHIF?TTL@@DDGJQ?WvBqE}BhFIBANE@ENKBKCKKKGKJqAvEAJIHINOr@KPK`@Yn@AHMZAJM\\KL]~@KHEASi@QUQq@U[Se@GE[s@S]IWCCAIECAKSW?KQUIOIEK[EEKSMKUYMAGOKMGCEIGCKQWQI[q@q@GO[a@Ka@GACIKMIAKWAI_@[CKECQUAU@SJOHELYPQFWDGFABG@SAQS[GSGGEKU_@GSMK?OES_@i@Cc@PWF@R?REBGFEJSL]?MBKDEDA@IFABIJ}@LKHMJ[NUP]BUDCF@TkA`@}@HS@MNY@KDEV_APQH[LMT_AD[LQ@KRS?MFMH]Za@Ns@AMHGVo@HKLEJMPKDADI^@HID?DCTFTCD@DDLID?F@FCF@DIF@DADBFEJ@NCJ@ZOF@ZER?LMRIZARIHALGVA^KDG`@GTCLEL@DCD?JMRG`@EVMBEZK@CHADGFEJ?DGNC\\ODEF?JOD?HKJCL^LRERq@`AMXE?_@r@SVSh@KHERGBAJKJG@Mf@I?GFAFML]p@KH[n@KHS\\Y`@E@IPGBKJS\\I\\OZMJKLCHMTSNMj@Cn@D^A\\J^FHCLJh@Bn@DF@LHXFb@DHBPFDLr@`@|@Eb@D^ATBT@j@YlAIFAFEFCD@JSh@I~@Sp@AZCJAZQn@KVC~@Kp@J^LBLRNFBHF?");

    const [selectedActivity, setSelectedActivity] = useState(null);
    const [activitiesWithOptions, setActivitiesWithOptions] = useState([]);

    const handleActivityChange = (event) => {
        setSelectedActivity(event.target.value);
    };

    useEffect(() => {
        if (activities !== undefined) {

            const filteredActivities = activities.filter(activity => activity.map && activity.map.summary_polyline)
                .map((activity, index) => ({
                    id: activity.id,
                    name: activity.name,
                    summary_polyline: activity.map.summary_polyline,
                    key: index
                }));
            setActivitiesWithOptions(filteredActivities);
        }
    }, [activities]);

    useEffect(() => {
        if (activitiesWithOptions.length > 0) {
            setPolyLineString(activitiesWithOptions[selectedActivity].summary_polyline);
            console.log(activitiesWithOptions[selectedActivity])
        }
    }, [selectedActivity]);

    return (
        <div>
            <GetAccess setAccessToken={setAccessToken}></GetAccess>
            <LoadData accessToken={accessToken} setActivities={setActivities}></LoadData>

            <label>Select Activity:</label>
            <select value={selectedActivity || ""} onChange={handleActivityChange}>
                <option value="">Select Activity</option>
                {activitiesWithOptions.map(activity => (
                    <option key={activity.key} value={activity.key}>
                        {`Activity ${activity.key + 1}`}
                    </option>
                ))}
            </select>

            <Map polyline={polylineString} activity={activitiesWithOptions[selectedActivity]}></Map>
            <DistanceChart distancePerMonth={distancePerMonth}></DistanceChart>
            <SpeedChart speedPerMonth={speedPerMonth}></SpeedChart>
            <DisplayActivities activities={activities}></DisplayActivities>
            <DisplayDistancePerMonth activities={activities} setDistancePerMonth={setDistancePerMonth} setSpeedPerMonth={setSpeedPerMonth}></DisplayDistancePerMonth>
        </div>
    );
};

export default HomePage;