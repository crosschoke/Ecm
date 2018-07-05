
package com.mycompany.ecmmaven;

import static com.mycompany.ecmmaven.HibernateUtil.getEm;
import java.util.List;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.Query;

/**
 *
 * @author Admin
 */
@Stateless
public class UnitBean {
    
    private EntityManager em;
    
    
    public List<Unit> getAll() {
        em = getEm();
        Query query = em.createQuery("SELECT e FROM Unit e");
        return (List<Unit>) query.getResultList();
    }
    
    
    public String add(String name, String contactDetails, String head, String organization) {
        
        Unit unit = create(name, contactDetails, head, organization);
        
        if(unit.getPersistStatus().equals("OK")) {
            //em = getEm();
            try {
               em.getTransaction().begin();
               em.persist(unit);
               em.getTransaction().commit();
            }
            catch(Exception ex) {
               return "Error";
            }
            return "OK";
        }
        else {
            return unit.getPersistStatus();
        }
    }
    
    public Unit create(String name, String contactDetails, String head, String organization) {
        em = getEm();
        
        String[] headFullname = head.split(" ");
        
        Query query = em.createQuery("Select e FROM Employer e WHERE e.surname = :surname and e.name = :name and e.patronymic = :patronymic");
        query.setParameter("surname", headFullname[0]);
        query.setParameter("name", headFullname[1]);
        query.setParameter("patronymic", headFullname[2]);
        
        Employer headObject;
        
        try {
            headObject = (Employer)query.getSingleResult();
        }
        catch(Exception ex){
            return new Unit("Head doesn't exist");
        }
        
        query = em.createQuery("Select e FROM Organization e WHERE e.name = :name");
        query.setParameter("name", organization);
        
        Organization organizationObject;
        
        try {
            organizationObject = (Organization)query.getSingleResult();
        }
        catch(Exception ex){
            return new Unit("Organization doesn't exist");
        }
        
        Unit unit = new Unit(name, contactDetails, headObject, organizationObject, "OK");
        
        return unit;
    }
    
    public String edit(Unit oldUnit, Unit newUnit) {
        
        em = getEm();
        Query query = em.createQuery("Select e FROM Unit e WHERE e.name = :name");
        query.setParameter("name", oldUnit.getName());

        Unit result = (Unit)query.getSingleResult();
        
        if(result != null) {

            em.getTransaction().begin();
            
            result.setName(newUnit.getName());
            result.setContactDetails(newUnit.getContactDetails());
            result.setUnitHead(newUnit.getUnitHead());
            result.setOrganization(newUnit.getOrganization());
            
            em.getTransaction().commit();
            
            return "OK";
        }
        
        else
            return "Error";
        
    }
    
    public String delete(String name) {
        
        em = getEm();

        Query query = em.createQuery("Select e FROM Unit e WHERE e.name = :name");
        query.setParameter("name", name);

        
        Unit result;
        
        try {
            result = (Unit)query.getSingleResult();
        }
        catch(Exception ex){
            return ex.getMessage();
        }
        
        em.getTransaction().begin();
        em.remove(result);
        em.getTransaction().commit();  
        
        return "OK";
    }
    
}
