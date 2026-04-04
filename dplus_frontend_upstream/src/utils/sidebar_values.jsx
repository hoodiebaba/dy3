
import * as Unicons from '@iconscout/react-unicons';
import RunQuery from '../pages/CustomQuery/RunQuery';
import QueryBuilderComponent from '../pages/CustomQuery/QueryBuilder';
// import BIDashboard from '../pages/InsightsEngine/BIDashboard.js';
import AdvancedQueryBuilderComponent from '../pages/CustomQuery/AdvancedQueryBuilder';
import TestTable from '../pages/DataPlusAnalytics/TestTable';
import CommonPowerBI from '../pages/CommonPowerBI';
import DataPlusAnalytics from '../pages/DataPlusAnalytics';
import LaverView from '../pages/LaverView';
import DBConfig from '../pages/CustomQuery/DBConfig';
import SavedQueries from '../pages/CustomQuery/SavedQueries';
import AlertConfigure from '../pages/AlertMonitoringSystem/AlertConfigure';
import ViewMtandaoComplaints from '../pages/MtandaoComplaints/ViewMtandaoComplaints';
import ISONForm from '../pages/iSON/iSonForm';
import AlertScheduler from '../pages/AlertMonitoringSystem/AlertScheduler';
import UserManagement from '../pages/Admin/UserManagement/UserManagement';
import RoleManagement from '../pages/Admin/RoleManagement/RoleManagement';
import NokiaToolManagementQuery from '../pages/NokiaToolManagement/NokiaToolManagementQuery';
// import NetworkAnalyticsPro from '../pages/DataPlusAnalytics/NetworkAnalyticsPro';
import SiteAnalyticsPro from '../pages/DataPlusAnalytics/SiteAnalyticsPro';
import ProRulesQuery from '../pages/ProRules/ProRulesQuery';
import MapView from '../pages/Map';
import MapBoxView from '../pages/MapBox';
import SettingConfigForm from '../pages/SettingConfig/SettingConfigForm';
import MapChart from '../pages/MapBox/MapChart';
import Scripting from '../pages/CX_IXSupport/Scripting';
import ParameterAudit from '../pages/CX_IXSupport/ParameterAudit';
import ScriptingPattern from '../pages/CX_IXSupport/ScriptingPattern';
import ScriptingPatternForm from '../pages/CX_IXSupport/ScriptingPatternFormOld';
import DBUpdate from '../pages/CX_IXSupport/DBUpdate';
import ScriptingPatternList from '../pages/CX_IXSupport/ScriptingPatternList';
import AuditPatternForm from '../pages/CX_IXSupport/AuditPatternForm';
import AuditPatternList from '../pages/CX_IXSupport/AuditPatternList';
import AuditPattern from '../pages/CX_IXSupport/AuditPattern';
import CellAnalyticsPro from '../pages/DataPlusAnalytics/CellAnalyticsPro';
import ProRulesQueryOutput from '../pages/ProRules/ProRulesQueryOutput';
import CellProRulesQueryOutput from '../pages/ProRules/CellProRulesQueryOutput';
import Home from '../pages/Home';
import SupersetDashboard from '../pages/SuperSet/SupersetDashboard';
import NetworkDashboard from '../pages/InsightsEngine/NetworkDashboard.jsx';
import ParameterAuditDashboard from '../pages/InsightsEngine/ParameterAuditDashboard.jsx';

import MssDashboard from '../pages/InsightsEngine/CoreDashboards/MssDashboard.jsx';
import UgwDashboard from '../pages/InsightsEngine/CoreDashboards/UgwDashboard.jsx';
import MgwDashboard from '../pages/InsightsEngine/CoreDashboards/MgwDashboard.jsx';

import WorstCellsDashboard from '../pages/InsightsEngine/RanDashboards/WorstCellsDashboard.jsx';
import Huawei4GDashboard from '../pages/InsightsEngine/RanDashboards/Huawei4GDashboard.jsx';
import Huawei5GDashboard from '../pages/InsightsEngine/RanDashboards/Huawei5GDashboard.jsx';
import NSAtoSA5GPrePostDashboard from '../pages/InsightsEngine/RanDashboards/NSAtoSA5GPrePostDashboard.jsx';
// import MapTesting from '../pages/InsightsEngine/MapTesting.jsx';
import TelecomMapsPage from '../pages/TelecomMapsPage.jsx';
import SupportDesk from '../pages/SupportDesk.jsx';
import TicketsPage from '../pages/Tickets/index.jsx';
import DiscussionPage from '../pages/DiscussionForum/DiscussionPage.jsx';
import NifiViewer from '../pages/nifi/index.jsx';

export const Sidebar_content = {
    temp: [],
    GlobalUrl: [
        {
            name: "Not Found",
            link: "*",
            subMenu: [],
            component: <>Coming Soon.</>,
        },{
            name: "Home",
            link: "/home",
            subMenu: [],
            component: <Home/>,
        },
        {
           name: "Dashboard Fullscreen",
            link: "/Filtered-cell-dashboard/:uuid",
            subMenu: [],
            component: <SupersetDashboard />
        },
        {
            name: "Map Chart",
            link: "/mapChart",
            subMenu: [],
            component: <MapChart/>,
            
        },
        {
            name: "Scripting Pattern",
            link: "/cx-ix-support/ScriptingPattern/:uid",
            subMenu: [],
            component: <ScriptingPattern/>,
            
        },
        {
            name: "Scripting Pattern Form",
            link: "/ScriptingPatternForm/:uid",
            subMenu: [],
            component: <ScriptingPatternList/>,
            
        },
        {
            name: "Audit Pattern",
            link: "/cx-ix-support/AuditPattern/:uid",
            subMenu: [],
            component: <AuditPattern/>,
            
        },
        {
            name: "Audit Pattern Form",
            link: "/AuditPatternPatternForm/:uid",
            subMenu: [],
            component: <AuditPatternList/>,
            
        },

        
    ],
    all_routes: [
        {
            name: "Topology Layer",
            link: "/topology-layer",
            icon: <Unicons.UilReact />,
            subMenu: [],
        },
        {
            name: "Layer View",
            link: "/layer-view",
            icon: <Unicons.UilReact />,
            subMenu: [{
                name: "Site Layer",
                link: "/layer-view/site-layer",
                subMenu: [],
                component: <LaverView />,
                icon: <Unicons.UilChannel size="16" />
            },
            {
                name: "Carrier Layer",
                link: "/layer-view/carrier-layer",
                subMenu: [],
                component: <MapView />,
                icon: <Unicons.UilChannel size="16" />
            },
            {
                name: "Cell Layer",
                link: "/map-box/carrier-layer",
                subMenu: [],
                component: <MapBoxView />,
                icon: <Unicons.UilChannel size="16" />
            }],

        },{
            name: "DataPlus Analytics Pro",
            link: "/dataplus-analytics-pro",
            icon: <Unicons.UilReact />,
            subMenu: [{
                name: "Site Analytics",
                link: "/dataplus-analytics-pro/site-analytics",
                subMenu: [],
                component: <SiteAnalyticsPro />,
                icon:     <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                className="w-5 h-5 text-white"
                                fill="currentColor"
                                >
                                {/* Antenna dot */}
                                <circle cx="12" cy="10" r="1.6" /> 

                                {/* Antenna mast */}
                                <path d="M11 12h2l1.6 8h-5.2L11 12z" /> 

                                {/* Signal waves */}
                                <path d="M7.8 9.5a5 5 0 0 0 0 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                <path d="M5.5 8a8 8 0 0 0 0 9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                <path d="M16.2 9.5a5 5 0 0 1 0 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                <path d="M18.5 8a8 8 0 0 1 0 9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                            </svg> 
            },{
                name: "Site Pro Rules",
                link: "/dataplus-analytics-pro/site-pro-rules",
                subMenu: [],
                component: <ProRulesQueryOutput />,
                icon: <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        >
                        {/* Antenna dot */}
                        <circle cx="12" cy="10" r="1.6" /> 

                        {/* Antenna mast */}
                        <path d="M11 12h2l1.6 8h-5.2L11 12z" />

                        {/* Signal waves */}
                        <path d="M7.8 9.5a5 5 0 0 0 0 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        <path d="M5.5 8a8 8 0 0 0 0 9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        <path d="M16.2 9.5a5 5 0 0 1 0 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        <path d="M18.5 8a8 8 0 0 1 0 9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />

                            {/* + badge */}
                            <path
                            d="M20.2 2v4.2M18.2 4.1h4"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            />
                    </svg> 
            },{
                name: "Cell Analytics",
                link: "/dataplus-analytics-pro/cell-analytics",
                subMenu: [],
                component: <CellAnalyticsPro />,
                icon: <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="w-5 h-5 text-white"
                        >
                        {/* Outlined signal fan */}
                        <path
                            d="M12 6C8.6 6 5.4 7.5 3 9.9L12 19l9-9.1C18.6 7.5 15.4 6 12 6Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinejoin="round"
                        />
                    </svg>
            },{
                name: "Cell Pro Rules",
                link: "/dataplus-analytics-pro/cell-pro-rules",
                subMenu: [],
                component: <CellProRulesQueryOutput />,
                icon: <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="w-5 h-5 text-white"
                        >
                        {/* Outlined cell sector (pie) */}
                        <path
                            d="M12 6C8.6 6 5.4 7.5 3 9.9L12 19l9-9.1C18.6 7.5 15.4 6 12 6Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinejoin="round"
                        />

                        {/* + icon — right & up */}
                        <path
                            d="M20.2 2v4.2M18.2 4.1h4"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    </svg>
            },{
                name: "KPI Check Rules",
                link: "/dataplus-analytics-pro/kpi-check-rules",
                subMenu: [],
                component: <NokiaToolManagementQuery />,
                icon: <Unicons.UilCheckCircle size="16" />
            },{
                name: "Pro Rules Management",
                link: "/dataplus-analytics-pro/pro-rules-management",
                subMenu: [],
                component: <ProRulesQuery />,
                icon: <Unicons.UilChannel size="16" />
            }],
        }, 
        {
            name: "Insights Engine",
            link: "/insights-engine",
            icon: <Unicons.UilReact />,
            subMenu: [
            //     {
            //     name: "RAN Dashboard",
            //     link: "/insights-engine/ran-dashboard",
            //     subMenu: [],
            //     component: <CommonPowerBI reportId={"971a078b-5783-41e8-a676-fd154fe0e597"} src={"https://app.powerbi.com/reportEmbed?reportId=971a078b-5783-41e8-a676-fd154fe0e597&autoAuth=true&ctid=8d2d9b81-d0ec-49f4-9466-732d6e42831c"} />,
            //     icon: <Unicons.UilChannel size="16" />
            // }, 
            // {
            //     name: "Access Dashboard",
            //     link: "/insights-engine/access-dashboard",
            //     subMenu: [],
            //     component: <CommonPowerBI reportId={"971a078b-5783-41e8-a676-fd154fe0e597"} src={"https://app.powerbi.com/reportEmbed?reportId=971a078b-5783-41e8-a676-fd154fe0e597&autoAuth=true&ctid=8d2d9b81-d0ec-49f4-9466-732d6e42831c"} />,
            //     icon: <Unicons.UilChannel size="16" />
            // }, 
            {
                name: "Core Dashboards",
                link: "/insights-engine/core-dashboard",
                subMenu: [
                    {
                        name: "MSS Dashboard",
                        link: "/insights-engine/core-dashboard/mss",
                        subMenu: [],
                        component:  <MssDashboard /> ,
                        icon: <Unicons.UilChartLine size="16" />
                    }, 
                     {
                        name: "UGW Dashboard",
                        link: "/insights-engine/core-dashboard/ugw",
                        subMenu: [],
                        component:  <UgwDashboard /> ,
                        icon: <Unicons.UilChartLine size="16" />
                    }, 
                     {
                        name: "MGW Dashboard",
                        link: "/insights-engine/core-dashboard/mgw",
                        subMenu: [],
                        component:  <MgwDashboard /> ,
                        icon: <Unicons.UilChartLine size="16" />
                    }, 
                ],
                // component:  ,
                icon: <Unicons.UilLayerGroup size="16" />
            }, 
            {
                name: "RAN Dashboards",
                link: "/insights-engine/ran-dashboard",
                 subMenu: [
                    {
                        name: "Worst Cells Dashboard",
                        link: "/insights-engine/ran-dashboard/worstcells",
                        subMenu: [],
                        component:  <WorstCellsDashboard/>,
                        icon: <Unicons.UilChartLine size="16" />
                    }, 
                    {
                        name: "4G Dashboard",
                        link: "/insights-engine/ran-dashboard/huawei4g",
                        subMenu: [],
                        component:  <Huawei4GDashboard/>,
                        icon: <Unicons.UilChartLine size="16" />
                    }, 
                     {
                        name: "5G NSA to SA Pre-Post Dashboard",
                        link: "/insights-engine/ran-dashboard/5GNSAtoSAPrePostDashboard",
                        subMenu: [],
                        component:  <NSAtoSA5GPrePostDashboard/>,
                        icon: <Unicons.UilChartLine size="16" />
                    }, 
                                         {
                        name: "5G Dashboard",
                        link: "/insights-engine/ran-dashboard/huawei5g",
                        subMenu: [],
                        component:  <Huawei5GDashboard/>,
                        icon: <Unicons.UilChartLine size="16" />
                    }, 
                ],
                icon: <Unicons.UilLayerGroup size="16" />
            },
            {
                name: "Network Dashboard",
                link: "/insights-engine/network-dashboard",
                subMenu: [],
                component:  <NetworkDashboard /> ,
                icon: <Unicons.UilChartLine size="16" />
            },
             {
                name: "Parameter Audit Dashboard",
                link: "/insights-engine/parameter-audit-dashboard",
                subMenu: [],
                component:  <ParameterAuditDashboard /> ,
                icon: <Unicons.UilChartLine size="16" />
            },
            // {
            //     name: "Map Testing",
            //     link: "/insights-engine/map-testing",
            //     subMenu: [],
            //     component:  <MapTesting /> ,
            //     icon: <Unicons.UilChartLine size="16" />
            // },
             // {
            //     name: "Security Dashboard",
            //     link: "/insights-engine/security-dashboard",
            //     subMenu: [],
            //     component: <CommonPowerBI reportId={"971a078b-5783-41e8-a676-fd154fe0e597"} src={"https://app.powerbi.com/reportEmbed?reportId=971a078b-5783-41e8-a676-fd154fe0e597&autoAuth=true&ctid=8d2d9b81-d0ec-49f4-9466-732d6e42831c"} />,
            //     icon: <Unicons.UilChannel size="16" />
            // },
        ]
        },
        {
            name: "Reporting Suite",
            link: "/reporting-suite",
            icon: <Unicons.UilReact />,
            subMenu: [{
                name: "Customized Report",
                link: "/reporting-suite/report-customization",
                subMenu: [],
                icon: <Unicons.UilChannel size="16" />
            }, {
                name: "Repository",
                link: "/reporting-suite/repository",
                subMenu: [],
                icon: <Unicons.UilChannel size="16" />
            },
        ],
        },
        // {
        //     name: "Discussions",
        //     link: "/discussions",
        //     // icon: <Unicons.UilComment size="16" />,
        //     icon: <Unicons.UilReact />,
        //     component: <DiscussionPage />,
        //     // component: <SupportDesk />,
        //     subMenu: [],
        // },
        {
            name: "Discussions",
            link: "/discussions",
            // icon: <Unicons.UilComment size="16" />,
            icon: <Unicons.UilReact />,
            component: <TicketsPage />,
            // component: <DiscussionPage />,
            // component: <SupportDesk />,
            subMenu: [],
        },
        {
            name: "NiFi",
            link: "/nifi-app",
            // icon: <Unicons.UilComment size="16" />,
            icon: <Unicons.UilReact />,
            component: <NifiViewer />,
            // component: <DiscussionPage />,
            // component: <SupportDesk />,
            subMenu: [],
        },
        
        {
            name: "GIS Engine",
            link: "/telecom-maps",
            subMenu: [],
            component:  <TelecomMapsPage /> ,
            icon: <Unicons.UilReact />,
        },
        {
            name: "Configuration Management",
            link: "/configuration-management",
            icon: <Unicons.UilReact />,
            subMenu: [{
                name: "Parameter Audit",
                link: "/configuration-management/parameter-audit",
                subMenu: [],
                component: <CommonPowerBI reportId={"35d0fc8b-6ef7-4c75-85a2-59e309ea6ff2"} src={""} />,
                icon: <Unicons.UilChannel size="16" />
            }, {
                name: "Neighbour Audit",
                link: "/configuration-management/neighbour-audit",
                subMenu: [],
                component: <CommonPowerBI reportId={"0a37d9e6-571d-421b-98ac-0b37945c8037"} src={"https://app.powerbi.com/reportEmbed?reportId=0a37d9e6-571d-421b-98ac-0b37945c8037&autoAuth=true&ctid=8d2d9b81-d0ec-49f4-9466-732d6e42831c"} />,
                icon: <Unicons.UilChannel size="16" />
            },
            // {
            //     name: "CM",
            //     link: "/configuration-management/cm",
            //     subMenu: [],
            //     icon: <Unicons.UilChannel size="16" />
            // }, 
            {
                name: "Daily Parameter Audit",
                link: "/configuration-management/daily-parameter-audit",
                subMenu: [],
                icon: <Unicons.UilChannel size="16" />
            }],
        },{
            name: "iSON",
            link: "/iSon/file-with-form",
            subMenu: [],
            component: <ISONForm />,
            icon: <Unicons.UilReact />,
        },  {
            name: "Custom Query",
            link: "/custom-query",
            icon: <Unicons.UilReact />,
            subMenu: [{
                name: "DB Config",
                link: "/custom-query/db-config",
                subMenu: [],
                component: <DBConfig />,
                icon: <Unicons.UilChannel size="16" />
            }, {
                name: "Advanced Query Builder",
                link: "/custom-query/advanced-query-builder",
                subMenu: [],
                component: <AdvancedQueryBuilderComponent />,
                icon: <Unicons.UilChannel size="16" />
            }, {
                name: "Run Query",
                link: "/custom-query/run-query",
                subMenu: [],
                component: <RunQuery />,
                icon: <Unicons.UilChannel size="16" />
                // }, {
                //     name: "Query Builder",
                //     link: "/custom-query/query-builder",
                //     subMenu: [],
                //     component:<QueryBuilderComponent />,
                //     icon: <Unicons.UilChannel size="16" />
            },
            // {
            //     name: "Save Query",
            //     link: "/custom-query/save-query",
            //     subMenu: [],
            //     component: <AdvancedQueryBuilderComponent />,
            //     icon: <Unicons.UilChannel size="16" />
            // }, 
            {
                name: "Saved Query List",
                link: "/custom-query/saved-query-list",
                subMenu: [],
                component: <SavedQueries />,
                icon: <Unicons.UilChannel size="16" />
            },],
        },
        {
            name: "xAlerts",
            link: "/report-scheduler",
            icon: <Unicons.UilReact />,
            subMenu: [{
                name: "Configure Scheduler",
                link: "/xAlerts/configure-scheduler",
                subMenu: [],
                component: <AlertConfigure />,
                icon: <Unicons.UilChannel size="16" />
            }, {
                name: "Alert Scheduler",
                link: "/xAlerts/alert-scheduler",
                subMenu: [],
                component: <AlertScheduler />,
                icon: <Unicons.UilChannel size="16" />
            }

                // {
                //     name: "CM",
                //     link: "/configuration-management/cm",
                //     subMenu: [],
                //     icon: <Unicons.UilChannel size="16" />
                // },
            ],
        },{
            name: "CX/IX Support",
            link: "/cx-ix-support",
            icon: <Unicons.UilReact />,
            subMenu: [{
                name: "Scripting",
                link: "/cx-ix-support/scripting",
                subMenu: [],
                component: <Scripting />,
                icon: <Unicons.UilChannel size="16" />
            }, {
                name: "Parameter Audit",
                link: "/cx-ix-support/parameteraudit",
                subMenu: [],
                component: <ParameterAudit />,
                icon: <Unicons.UilChannel size="16" />
            }, {
                name: "DB Update",
                link: "/cx-ix-support/dbupdate",
                subMenu: [],
                component: <DBUpdate />,
                icon: <Unicons.UilChannel size="16" />
            }],
        },
        {
            name: "Network Complaints",
            link: "/network-complaints/view-network-complaints",
            subMenu: [],
            component: <ViewMtandaoComplaints />,
            icon: <Unicons.UilReact />,
        },
        


        // {

        // }
        
        {
            name: "Fault Management",
            link: "/fault-management",
            icon: <Unicons.UilReact />,
            subMenu: [],
        },
        {
            name: "Capacity Management",
            link: "/capacity-management",
            icon: <Unicons.UilReact />,
            subMenu: [{
                name: "Resource Utilization",
                link: "/capacity-management/resource-utilization",
                subMenu: [],
                icon: <Unicons.UilChannel size="16" />
            }],
        },
        {
            name: "Revenue Assurance",
            link: "/revenue-assurance",
            icon: <Unicons.UilReact />,
            subMenu: [],
        },
        //     name: "DataPlus Analytics Pro",
        //     link: "/network-analytics",
        //     icon: <Unicons.UilReact />,
        //     subMenu: [{
        //         name: "Pre Post Comparison",
        //         link: "/network-analytics/pre-post-comparison",
        //         subMenu: [],
        //         component: <DataPlusAnalytics />,
        //         icon: <Unicons.UilChannel size="16" />
        //     }],
        // }, {
           
        {
            name: "Work Force Management",
            link: "/work-force-management",
            icon: <Unicons.UilReact />,
            subMenu: [{
                name: "Auto TT Dispatch",
                link: "/work-force-management/auto-tt-dispatch",
                subMenu: [],
                icon: <Unicons.UilChannel size="16" />
            }],
        },
        {
            name: "Change Management",
            link: "/change-management",
            icon: <Unicons.UilReact />,
            subMenu: [{
                name: "Plan Work Order",
                link: "/change-management/plan-work-order",
                subMenu: [],
                icon: <Unicons.UilChannel size="16" />
            }],
        },
        // {
        //     name: "Testing",
        //     link: "/testing",
        //     icon: <Unicons.UilReact />,
        //     subMenu: [{
        //         name: "Table",
        //         link: "/testing/table",
        //         subMenu: [],
        //         component: <TestTable></TestTable>,
        //         icon: <Unicons.UilChannel size="16" />
        //     }],
        // },
        {
            name: "Network Inventory",
            link: "/network-inventory",
            icon: <Unicons.UilReact />,
            subMenu: [{
                name: "Site Database",
                link: "/network-inventory/site-database",
                subMenu: [],
                icon: <Unicons.UilChannel size="16" />
            }, {
                name: "Auto Discovery",
                link: "/network-inventory/auto-discovery",
                subMenu: [],
                icon: <Unicons.UilChannel size="16" />
            }],
        }, {
            name: "Nokia Tool Management Query",
            link: "/nokia-tool-management-query",
            component: <NokiaToolManagementQuery/>,
            icon: <Unicons.UilReact />,
            subMenu: [],
        }, {
            name: "Map Settings",
            link: "/selectSettings",
            icon: <Unicons.UilReact />,
            subMenu: [],
            component:<SettingConfigForm />
        },
        ],

    Admin:[
        {
            name: "Admin",
            link: "/admin",
            subMenu: [{
                name: "User Management",
                link: "/admin/user-management",
                subMenu: [],
                component: <UserManagement />,
                icon: <Unicons.UilChannel size="16" />
            }, {
                name: "Role Management",
                link: "/admin/role-management",
                subMenu: [],
                component: <RoleManagement />,
                icon: <Unicons.UilChannel size="16" />
            }],
            icon: <Unicons.UilReact />,
        },
    ]
}