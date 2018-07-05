/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mycompany.ecmmaven;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;

public class HibernateUtil { 

    private static final String PERSISTENT_UNIT_NAME = "devP";

    private static final EntityManagerFactory emf;

    static {
        try {
            emf = Persistence.createEntityManagerFactory(PERSISTENT_UNIT_NAME);
        } catch (Throwable ex) {
            throw new ExceptionInInitializerError(ex);
        }
    }

    public static EntityManager getEm() {
        return emf.createEntityManager();
    }
}


/*
        String PERSISTENT_UNIT_NAME = "devP";
        EntityManagerFactory emf;
        emf = Persistence.createEntityManagerFactory(PERSISTENT_UNIT_NAME);
        em = emf.createEntityManager();
*/