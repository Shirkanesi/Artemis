package de.tum.in.www1.artemis.dataUpdater;

import java.sql.Connection;

import javax.sql.DataSource;

import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.autoconfigure.liquibase.LiquibaseProperties;

import liquibase.Liquibase;
import liquibase.changelog.visitor.ChangeExecListener;
import liquibase.exception.LiquibaseException;
import liquibase.integration.spring.SpringLiquibase;
import tech.jhipster.config.liquibase.SpringLiquibaseUtil;

public class SpringLiquibaseExtension extends SpringLiquibase {

    private ChangeExecListener changeExecListener = null;

    /**
     *
     * @param liquibaseDatasource
     * @param liquibaseProperties
     * @param dataSource
     * @param dataSourceProperties
     * @param changeExecListener
     * @return SpringLiquibaseExtension
     */
    public static SpringLiquibaseExtension create(DataSource liquibaseDatasource, LiquibaseProperties liquibaseProperties, DataSource dataSource,
            DataSourceProperties dataSourceProperties, ChangeExecListener changeExecListener) {
        SpringLiquibase springLiquibase = SpringLiquibaseUtil.createSpringLiquibase(liquibaseDatasource, liquibaseProperties, dataSource, dataSourceProperties);
        SpringLiquibaseExtension extension = new SpringLiquibaseExtension();
        extension.setDataSource(springLiquibase.getDataSource());
        extension.changeExecListener = changeExecListener;
        return extension;
    }

    /**
     *
     * @param c
     * @return SpringLiquibaseExtension
     */
    @Override
    protected Liquibase createLiquibase(Connection c) throws LiquibaseException {
        Liquibase liquibase = super.createLiquibase(c);
        liquibase.setChangeExecListener(changeExecListener);

        return liquibase;
    }
}
