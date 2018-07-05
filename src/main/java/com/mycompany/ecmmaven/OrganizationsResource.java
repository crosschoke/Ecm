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
@Path("/organizations/{type}")
public class OrganizationsResource {
    
    @EJB
    private OrganizationBean organizationBean;
    
    @GET
    @Produces("application/json")
    public String get(@PathParam("type") String type)  {
        
        if(type.equals("all")) {
            
            List<Organization> organizations = organizationBean.getAll();
            
            JSONArray list = new JSONArray();
            JSONObject organization;

            for(int i = 0; i < organizations.size(); i++) {
                Organization  tmp = organizations.get(i);
                organization = new JSONObject();
                organization.put("name",tmp.getName());
                organization.put("physAddress",tmp.getPhysicalAddress());
                organization.put("jurAddress",tmp.getJuridicalAddress());
                organization.put("head",tmp.getHead().getFullname());

                String units = "";
                
                Set<Unit> unitsSet = tmp.getUnits();
                Iterator<Unit> iter = unitsSet.iterator();
                while(iter.hasNext()) {
                    Unit unit = iter.next();
                    String res = unit.getName();
                    if(iter.hasNext())
                        res += ";";
                    units += res;
                }
            
                organization.put("units", units);

                list.add(organization);
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
            String physAddress = (String)jsonData.get("physAddress");
            String jurAddress = (String)jsonData.get("jurAddress");
            String head = (String)jsonData.get("head");
            /*
            String rawUnits = (String)jsonData.get("executor");

            String[] units = rawExecutors.split(";");
            */
            String status = organizationBean.add(name, physAddress, jurAddress, head);
            
            return status;
        }
        
        else if(type.equals("edit")) {
            JSONObject jsonData = (JSONObject)obj;
            
            JSONObject oldRecord = (JSONObject)jsonData.get("oldRecord");
            
            String name = (String)oldRecord.get("name");
            String physAddress = (String)oldRecord.get("physAddress");
            String jurAddress = (String)oldRecord.get("jurAddress");
            String head = (String)oldRecord.get("head");
            
            Organization oldOrganization = organizationBean.create(name, physAddress, jurAddress, head);
            
            JSONObject newRecord = (JSONObject)jsonData.get("newRecord");
            
            name = (String)newRecord.get("name");
            physAddress = (String)newRecord.get("physAddress");
            jurAddress = (String)newRecord.get("jurAddress");
            head = (String)newRecord.get("head");
            
            Organization newOrganization = organizationBean.create(name, physAddress, jurAddress, head);
            
            if(newOrganization.getPersistStatus().equals("OK"))
                return organizationBean.edit(oldOrganization, newOrganization);
            
            return null;
        }
        
        else if(type.equals("delete")) {
            JSONObject jsonData = (JSONObject)obj;

            String name = (String)jsonData.get("name");
            
            String status = organizationBean.delete(name);
            
            return status;
        }
        
        return null;
    }
}