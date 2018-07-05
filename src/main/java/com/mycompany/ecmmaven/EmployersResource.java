/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mycompany.ecmmaven;

import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
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
import org.json.simple.parser.*;

/**
 *
 * @author Admin
 */
@Path("/employers/{type}")
public class EmployersResource {
    
    @EJB
    private EmployerBean employerBean;
    
    @GET
    @Produces("application/json")
    public String getAllEmployers() {
        List<Employer> employers = employerBean.getAll();
        JSONArray list = new JSONArray();
        JSONObject obj;
        
        for(int i = 0; i < employers.size(); i++) {
            Employer tmp = employers.get(i);
            obj = new JSONObject();
            obj.put("surname",tmp.getSurname());
            obj.put("name",tmp.getName());
            obj.put("patronymic",tmp.getPatronymic());
            obj.put("post",tmp.getPost());
            list.add(obj);
        }
       
        return list.toString();

    }
    
    @POST
    @Consumes("application/json")
    public String changeEmployer(String data, @PathParam("type") String type) {
        JSONParser parser = new JSONParser();
        Object obj;
        try{
            obj = parser.parse(data);
        }
        catch(ParseException p) {
            return p.getMessage();
        }

        if(type.equals("addEmployer")) {
            
            JSONObject jsonData = (JSONObject)obj;

            String name = (String)jsonData.get("name");
            String surname = (String)jsonData.get("surname");
            String patronymic = (String)jsonData.get("patronymic");
            String post = (String)jsonData.get("post");
            
            String status = employerBean.add(new Employer(surname, name, patronymic, post));

            return status;
            //return (String)jsonData.get("name");
        }
        
        else if(type.equals("editEmployer")){ 
            JSONObject jsonData = (JSONObject)obj;
            
            JSONObject oldRecord = (JSONObject)jsonData.get("oldRecord");
            
            String name = (String)oldRecord.get("name");
            String surname = (String)oldRecord.get("surname");
            String patronymic = (String)oldRecord.get("patronymic");
            String post = (String)oldRecord.get("post");
            
            Employer oldEmployer = new Employer(surname, name, patronymic, post);
            
            JSONObject newRecord = (JSONObject)jsonData.get("newRecord");
            
            name = (String)newRecord.get("name");
            surname = (String)newRecord.get("surname");
            patronymic = (String)newRecord.get("patronymic");
            post = (String)newRecord.get("post");
            
            Employer newEmployer = new Employer(surname, name, patronymic, post);
           
            String status = employerBean.edit(oldEmployer, newEmployer);
            
            return status;
        }
        
        else {
            JSONObject jsonData = (JSONObject)obj;

            String name = (String)jsonData.get("name");
            String surname = (String)jsonData.get("surname");
            String patronymic = (String)jsonData.get("patronymic");
            String post = (String)jsonData.get("post");
            
            String status = employerBean.delete(new Employer(surname, name, patronymic, post));
            
            return status;
        }
    }
}
