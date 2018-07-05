/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mycompany.ecmmaven;

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
import org.json.simple.parser.ParseException;

/**
 *
 * @author Admin
 */
@Path("/units/{type}")
public class UnitsResource {
    
    @EJB
    private UnitBean unitBean;
    
    @GET
    @Produces("application/json")
    public String get(@PathParam("type") String type)  {
        
        if(type.equals("all")) {
            
            List<Unit> units = unitBean.getAll();
            
            JSONArray list = new JSONArray();
            JSONObject unit;

            for(int i = 0; i < units.size(); i++) {
                Unit  tmp = units.get(i);
                unit = new JSONObject();
                unit.put("name",tmp.getName());
                unit.put("contactDetails",tmp.getContactDetails());
                unit.put("head",tmp.getUnitHead().getFullname());
                unit.put("organization",tmp.getOrganization().getName());


                list.add(unit);
            }

            return list.toString();
        } 
        return null;
    }
    
    @POST
    @Consumes("application/json")
    public String change(String data, @PathParam("type") String type) throws java.text.ParseException {
    
        JSONParser parser = new JSONParser();
        Object obj;
        try{
            obj = parser.parse(data);
        }
        catch(ParseException p) {
            return p.getMessage();
        }
        
        if(type.equals("add")) {
            
            JSONObject jsonData = (JSONObject)obj;

            String name = (String)jsonData.get("name");
            String contactDetails = (String)jsonData.get("contactDetails");
            String head = (String)jsonData.get("head");
            String organization = (String)jsonData.get("organization");
           
            String status = unitBean.add(name, contactDetails, head, organization);
            
            return status;
        }
        
        else if(type.equals("edit")) {
            JSONObject jsonData = (JSONObject)obj;
            
            JSONObject oldRecord = (JSONObject)jsonData.get("oldRecord");
            
            String name = (String)oldRecord.get("name");
            String contactDetails = (String)oldRecord.get("contactDetails");
            String head = (String)oldRecord.get("head");
            String organization = (String)oldRecord.get("organization");
            
            Unit oldUnit = unitBean.create(name, contactDetails, head, organization);
            
            JSONObject newRecord = (JSONObject)jsonData.get("newRecord");
            
            name = (String)newRecord.get("name");
            contactDetails = (String)newRecord.get("contactDetails");
            head = (String)newRecord.get("head");
            organization = (String)newRecord.get("organization");
            
            Unit newUnit = unitBean.create(name, contactDetails, head, organization);
            
            if(newUnit.getPersistStatus().equals("OK"))
                return unitBean.edit(oldUnit, newUnit);
            
            return null;
        }
        
        else if(type.equals("delete")) {
            JSONObject jsonData = (JSONObject)obj;

            String name = (String)jsonData.get("name");
            
            String status = unitBean.delete(name);
            
            return status;
        }
        
        return null;
    }
    
}
