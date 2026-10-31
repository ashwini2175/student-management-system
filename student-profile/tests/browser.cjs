// UI regression test with explicit API fixtures. This does NOT test MongoDB.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 let role='Student';
 let account={_id:'s1',name:'Demo Student',prn:'DEMO-STUDENT',email:'student@example.test',department:'CSE',year:3,cgpa:8,skills:['React','Node.js'],projects:[],certificates:[],internshipCount:1,aptitudeScore:70,communicationScore:80,placementScore:61,placementStatus:'Needs Guidance',profilePhoto:'',resumeUrl:'',interestDomain:'Full stack',updatedAt:'2026-10-22T00:00:00Z'};
 const teacher={name:'Demo Teacher',employeeId:'T1'};
 const drives=[{_id:'d1',company:'Demo Tech',role:'MERN Intern',eligibilityCGPA:7,package:'8 LPA',driveDate:'2099-10-25',time:'09:30',location:'Campus',description:'Build useful products.'}];
 await page.route('http://localhost:5000/**',async route=>{
 const req=route.request(),path=new URL(req.url()).pathname,method=req.method();let data={},status=200;
 const headers={'Access-Control-Allow-Origin':'http://127.0.0.1:5173','Access-Control-Allow-Credentials':'true','Access-Control-Allow-Headers':'*','Access-Control-Allow-Methods':'*'};
 if(method==='OPTIONS'){await route.fulfill({status:204,headers});return;}
 const body=req.postDataJSON();
 if(path==='/student/login'){role='Student';data={token:'fixture-student',student:account};}
 else if(path==='/teacher/login'){role='Teacher';data={token:'fixture-teacher',teacher};}
 else if(path==='/auth/me')data={role,account:role==='Student'?account:teacher};
 else if(path==='/events'){await route.fulfill({contentType:'text/event-stream',headers,body:'data: {"type":"connected"}\n\n'});return;}
 else if(path==='/student/profile'){if(method==='PUT')account={...account,...body,updatedAt:new Date().toISOString()};data=method==='PUT'?{student:account}:account;}
 else if(path==='/student/projects'){if(method==='POST'){account.projects.push({...body,_id:'p1'});data={project:account.projects.at(-1)};}else data={projects:account.projects};}
 else if(path.startsWith('/student/projects/')){if(method==='PUT'){account.projects[0]={...account.projects[0],...body};data={project:account.projects[0]};}else {account.projects=[];data={message:'Deleted'};}}
 else if(path==='/student/certificates')data={certificates:[]};
 else if(path==='/student')data=[account];
 else if(path.startsWith('/student/'))data=account;
 else if(path==='/placement')data=drives;
 else if(path.startsWith('/notification'))data=[{_id:'n1',title:'Demo Tech placement',message:'New drive available',isRead:false,createdAt:'2026-10-22'}];
 else if(path.startsWith('/guidance'))data=method==='POST'?{message:'Guidance sent'}:[{_id:'g1',studentPRN:account.prn,title:'Practice APIs',message:'Implement validation.',category:'Project',createdAt:'2026-10-22'}];
 else if(path==='/training')data=[{_id:'m1',title:'React learning',year:3,type:'Link',link:'https://react.dev/learn',category:'Web',uploadedBy:'Demo Teacher'}];
 else{status=404;data={message:'Fixture endpoint missing: '+path};}
 await route.fulfill({status,contentType:'application/json',headers,body:JSON.stringify(data)});
 });
 const base=process.env.UI_URL||'http://127.0.0.1:5173';
 try{
 await page.goto(base+'/login');await page.getByLabel('PRN',{exact:true}).fill('DEMO-STUDENT');await page.getByLabel('Password',{exact:true}).fill('TestPassword123!');await page.getByRole('button',{name:'Sign in',exact:true}).click();await page.getByRole('heading',{name:'Welcome, Demo'}).waitFor();
 await page.getByRole('link',{name:'Projects',exact:true}).click();await page.getByRole('button',{name:'+ Add project'}).click();await page.getByLabel('Project name').fill('My portal');await page.getByLabel('GitHub repository').fill('https://github.com/demo/portal');await page.getByLabel('Status',{exact:true}).selectOption('Completed');await page.getByRole('button',{name:'Save',exact:true}).click();await page.getByRole('heading',{name:'My portal'}).waitFor();
 await page.getByRole('button',{name:'Edit',exact:true}).click();await page.getByLabel('Project name').fill('Edited portal');await page.getByRole('button',{name:'Save',exact:true}).click();await page.getByRole('heading',{name:'Edited portal'}).waitFor();
 page.once('dialog',d=>d.accept());await page.getByRole('button',{name:'Delete',exact:true}).click();await page.getByText('No projects yet.').waitFor();
 for(const [path,heading] of [['/profile','Your profile'],['/career','Career & placement'],['/certificates','Certificates'],['/notifications','Notifications'],['/training','Learning materials'],['/settings','Account settings']]){await page.goto(base+path);await page.getByRole('heading',{name:heading,exact:true}).waitFor();}
 await page.goto(base+'/career');await page.getByRole('heading',{name:'Demo Tech',exact:true}).waitFor();await page.getByText('View details',{exact:true}).click();await page.getByText('Build useful products.').waitFor();
 if(process.env.QA_SCREENSHOTS)await page.screenshot({path:process.env.QA_SCREENSHOTS+'/career-desktop.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});if(process.env.QA_SCREENSHOTS)await page.screenshot({path:process.env.QA_SCREENSHOTS+'/career-mobile.png',fullPage:true});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth));
 await page.getByRole('button',{name:'Menu',exact:true}).click();await page.getByRole('navigation',{name:'Main navigation'}).waitFor();await page.getByRole('link',{name:'Profile',exact:true}).click();await page.getByRole('heading',{name:'Your profile',exact:true}).waitFor();assert.equal(await page.getByRole('button',{name:'Menu',exact:true}).getAttribute('aria-expanded'),'false');
 await page.getByRole('button',{name:'Sign out',exact:true}).click();await page.getByRole('button',{name:'Teacher',exact:true}).click();await page.getByLabel('Employee ID').fill('T1');await page.getByLabel('Department',{exact:true}).fill('CSE');await page.getByLabel('Password',{exact:true}).fill('TestPassword123!');await page.getByRole('button',{name:'Sign in',exact:true}).click();await page.getByRole('heading',{name:'Welcome, Demo'}).waitFor();
 await page.setViewportSize({width:1440,height:1000});
 if(process.env.QA_SCREENSHOTS)await page.screenshot({path:process.env.QA_SCREENSHOTS+'/teacher-dashboard.png',fullPage:true});
 for(const [path,heading] of [['/students','Student directory'],['/guidance','Student guidance'],['/placements','Placement drives'],['/training','Learning materials']]){await page.goto(base+path);await page.getByRole('heading',{name:heading,exact:true}).waitFor();}
 await page.goto(base+'/students/DEMO-STUDENT');await page.getByRole('heading',{name:'Demo Student',exact:true}).waitFor();
 assert.deepEqual(errors,[]);console.log('PASS: UI login, session restore, project CRUD, student/teacher routes, drive details, mobile overflow and zero runtime errors (API fixtures).');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
