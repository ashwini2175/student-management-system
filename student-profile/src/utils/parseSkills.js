function parseSkills(value) {
 const list=Array.isArray(value)?value:[value];
 if(list.some(x=>typeof x!=="string"))throw new Error("Skills must be text.");
 if(list.join('').length>10000)throw new Error("Skills input too long.");
 const aliases={js:'JavaScript',javascript:'JavaScript',reactjs:'React','react.js':'React',react:'React',nodejs:'Node.js','node.js':'Node.js',express:'Express',expressjs:'Express',mongodb:'MongoDB',sql:'SQL',html:'HTML',css:'CSS',java:'Java',python:'Python',git:'Git',powerbi:'Power BI','power bi':'Power BI'};
 const seen=new Set(),result=[];
 const input=list.join('\n').replace(/\b(?:programming languages|languages|web technologies|technologies|databases|core concepts|soft skills|technical skills|frameworks|tools|skills)\s*:/gi,'\n');
 for(const raw of input.split(/[,;\n\r•|]+/)){
 const s=raw.replace(/^\s*(?:[-*]\s+|\d+[.)]\s+)/,'').trim().replace(/\s+/g,' ');if(!s)continue;
 if(s.length>60)throw new Error('Separate skills with commas or new lines (60 characters per skill maximum).');
 const canonical=aliases[s.toLowerCase()]||s;
 if(!seen.has(canonical.toLowerCase())){seen.add(canonical.toLowerCase());result.push(canonical);}
 }
 if(result.length>30)throw new Error('Provide up to 30 distinct skills.');return result;
}

export {parseSkills};