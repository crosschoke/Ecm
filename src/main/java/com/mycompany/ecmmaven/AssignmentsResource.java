/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mycompany.ecmmaven;

import java.text.SimpleDateFormat;
import java.util.Iterator;
import java.util.List;
import java.util.Set;
import javax.ejb.EJB;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

/**
 *
 * @author Admin
 */
@Path("/assignments/{type}")
public class AssignmentsResource {
    
    @EJB
    private AssignmentBean assignmentBean;
    
    @GET
    @Path("{params}")
    @Produces("application/json")
    public String getAssignments(@PathParam("type") String type, @PathParam("params") String params)  {
    //public String getAssignments() {
        if(type.equals("all")) {
            List<Assignment> assignments = assignmentBean.getAll();
            
            JSONArray list = new JSONArray();
            JSONObject assignment;

            for(int i = 0; i < assignments.size(); i++) {
                Assignment tmp = assignments.get(i);
                assignment = new JSONObject();
                assignment.put("subject",tmp.getSubject());
                assignment.put("author",tmp.getAuthor().getFullname());
                assignment.put("controlAttribute",tmp.getControlAttribute() + "");
                assignment.put("executionDate",tmp.getExecutionDate().toString());
                assignment.put("executionAttribute",tmp.getExecutionAttribute().toString());

                String executors = "";

                Set<Employer> executorsSet = tmp.getExecutors();
                Iterator<Employer> iter = executorsSet.iterator();
                while(iter.hasNext()) {
                    Employer emp = iter.next();
                    String res = emp.getFullname();
                    if(iter.hasNext())
                        res += ";";
                    executors += res;
                }

                assignment.put("executors", executors);

                list.add(assignment);
            }

            return list.toString();
        }
        
        else if(type.equals("myAssignments")) {
           
            String[] fullname = params.split(" ");
            List<Assignment> assignments = assignmentBean.getMyAssignments(fullname[0], fullname[1], fullname[2]);
            
            if(assignments == null)
                return null;
            
            JSONArray list = new JSONArray();
            JSONObject assignment;
            
            for(int i = 0; i < assignments.size(); i++) {
                Assignment tmp = assignments.get(i);
                assignment = new JSONObject();
                assignment.put("subject",tmp.getSubject());
                assignment.put("author",tmp.getAuthor().getFullname());
                assignment.put("controlAttribute",tmp.getControlAttribute() + "");
                assignment.put("executionDate",tmp.getExecutionDate().toString());
                assignment.put("executionAttribute",tmp.getExecutionAttribute().toString());

                String executors = "";

                Set<Employer> executorsSet = tmp.getExecutors();
                Iterator<Employer> iter = executorsSet.iterator();
                while(iter.hasNext()) {
                    Employer emp = iter.next();
                    String res = emp.getFullname();
                    if(iter.hasNext())
                        res += ";";
                    executors += res;
                }

                assignment.put("executors", executors);

                list.add(assignment);
            }
            
            return list.toString();
        }
        
        else if(type.equals("assignmentsForMe")) {
            
            String[] fullname = params.split(" ");
            List<Assignment> assignments = assignmentBean.getAssignmentsForMe(fullname[0], fullname[1], fullname[2]);
            
            if(assignments == null)
                return null;
            
            JSONArray list = new JSONArray();
            JSONObject assignment;
            
            for(int i = 0; i < assignments.size(); i++) {
                Assignment tmp = assignments.get(i);
                assignment = new JSONObject();
                assignment.put("subject",tmp.getSubject());
                assignment.put("author",tmp.getAuthor().getFullname());
                assignment.put("controlAttribute",tmp.getControlAttribute() + "");
                assignment.put("executionDate",tmp.getExecutionDate().toString());
                assignment.put("executionAttribute",tmp.getExecutionAttribute().toString());

                String executors = "";

                Set<Employer> executorsSet = tmp.getExecutors();
                Iterator<Employer> iter = executorsSet.iterator();
                while(iter.hasNext()) {
                    Employer emp = iter.next();
                    String res = emp.getFullname();
                    if(iter.hasNext())
                        res += ";";
                    executors += res;
                }

                assignment.put("executors", executors);

                list.add(assignment);
            }
            

            return list.toString();
        }
        
        return null;
    }
    
    @POST
    @Consumes("application/json")
    public String changeAssignment(String data, @PathParam("type") String type) throws java.text.ParseException {
        
        JSONParser parser = new JSONParser();
        Object obj;
        try{
            obj = parser.parse(data);
        }
        catch(ParseException p) {
            return p.getMessage();
        }
        
        if(type.equals("addAssignment")) {
            
            JSONObject jsonData = (JSONObject)obj;

            String subject = (String)jsonData.get("subject");
            String author = (String)jsonData.get("author");
            boolean control = (boolean)jsonData.get("control");
            String text = (String)jsonData.get("text");
            
            String rawDate = (String)jsonData.get("date");
            SimpleDateFormat format = new SimpleDateFormat("dd.MM.yyyy");
            java.util.Date parsed = format.parse(rawDate);
            java.sql.Date date = new java.sql.Date(parsed.getTime());
            
            ExecutionAttributeEnum execution = ExecutionAttributeEnum.valueOf((String)jsonData.get("execution"));
            
            String rawExecutors = (String)jsonData.get("executor");

            String[] executors = rawExecutors.split(";");
            
            String status = assignmentBean.add(subject, author, text, control, date, execution, executors);
            
            return status;
        }
        
        else if(type.equals("editAssignment")) {
            
            JSONObject jsonData = (JSONObject)obj;
            
            JSONObject oldRecord = (JSONObject)jsonData.get("oldRecord");
            
            String subject = (String)oldRecord.get("subject");
            String author = (String)oldRecord.get("author");
            boolean control = Boolean.valueOf((String)oldRecord.get("control"));
            String text = (String)oldRecord.get("text");
            
            String rawDate = (String)oldRecord.get("date");
            SimpleDateFormat format = new SimpleDateFormat("dd.MM.yyyy");
            java.util.Date parsed = format.parse(rawDate);
            java.sql.Date date = new java.sql.Date(parsed.getTime());
            
            ExecutionAttributeEnum execution = ExecutionAttributeEnum.valueOf((String)oldRecord.get("execution"));
            
            String rawExecutors = (String)oldRecord.get("executor");

            String[] executors = rawExecutors.split(";");
            
            Assignment oldAssignment = assignmentBean.create(subject, author, text, control, date, execution, executors);
            
            JSONObject newRecord = (JSONObject)jsonData.get("newRecord");
            
            subject = (String)newRecord.get("subject");
            author = (String)newRecord.get("author");
            control = (boolean)newRecord.get("control");
            text = (String)newRecord.get("text");
            
            rawDate = (String)newRecord.get("date");
            parsed = format.parse(rawDate);
            date = new java.sql.Date(parsed.getTime());
            
            execution = ExecutionAttributeEnum.valueOf((String)newRecord.get("execution"));
            
            rawExecutors = (String)newRecord.get("executor");
            executors = rawExecutors.split(";");
            
            Assignment newAssignment = assignmentBean.create(subject, author, text, control, date, execution, executors);
            
            if(newAssignment.getPesistStatus().equals("OK")) {
                String status = assignmentBean.edit(oldAssignment, newAssignment);
                
                return status;
            }
            
            
        }
        
        else if(type.equals("getAssignmentText")) {
            
            JSONObject jsonData = (JSONObject)obj;

            String subject = (String)jsonData.get("subject");
            String author = (String)jsonData.get("author");
            
            String text = assignmentBean.getAssignmentText(subject, author);
            
            return text;
        }
        
        else if(type.equals("delete")) {
            
            JSONObject jsonData = (JSONObject)obj;

            String subject = (String)jsonData.get("subject");
            String author = (String)jsonData.get("author");
            
            String status = assignmentBean.delete(subject, author);
            
            return status;
        }
        
        
        return null;
    }
}
