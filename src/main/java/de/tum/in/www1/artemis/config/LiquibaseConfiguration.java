package de.tum.in.www1.artemis.config;

import javax.sql.DataSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.autoconfigure.liquibase.LiquibaseDataSource;
import org.springframework.boot.autoconfigure.liquibase.LiquibaseProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.core.env.Profiles;

import de.tum.in.www1.artemis.dataUpdater.DBDataChangeExecListener;
import de.tum.in.www1.artemis.dataUpdater.SpringLiquibaseExtension;
import liquibase.integration.spring.SpringLiquibase;
import tech.jhipster.config.JHipsterConstants;

@Configuration
public class LiquibaseConfiguration {

    private final Logger log = LoggerFactory.getLogger(LiquibaseConfiguration.class);

    private final Environment env;

    // private final DBDataChangeExecListener dbDataChangeExecListener;

    public LiquibaseConfiguration(Environment env/* , DBDataChangeExecListener dbDataChangeExecListener */) {
        this.env = env;
        // this.dbDataChangeExecListener = dbDataChangeExecListener;
    }

    /**
     * reads properties and configures liquibase
     *
     * @param liquibaseDataSource the liquibase sql data source
     * @param liquibaseProperties the liquibase properties
     * @param dataSource the sql data source
     * @param dataSourceProperties data source properties
     * @return the configured spring liquibase object
     */
    @Bean
    public SpringLiquibase liquibase(@LiquibaseDataSource ObjectProvider<DataSource> liquibaseDataSource, LiquibaseProperties liquibaseProperties,
            ObjectProvider<DataSource> dataSource, DataSourceProperties dataSourceProperties, DBDataChangeExecListener dbDataChangeExecListener) {
        SpringLiquibaseExtension liquibase = SpringLiquibaseExtension.create(liquibaseDataSource.getIfAvailable(), liquibaseProperties, dataSource.getIfUnique(),
                dataSourceProperties, dbDataChangeExecListener);
        liquibase.setChangeLog("classpath:config/liquibase/master.xml");
        liquibase.setContexts(liquibaseProperties.getContexts());
        liquibase.setDefaultSchema(liquibaseProperties.getDefaultSchema());
        liquibase.setLiquibaseSchema(liquibaseProperties.getLiquibaseSchema());
        liquibase.setLiquibaseTablespace(liquibaseProperties.getLiquibaseTablespace());
        liquibase.setDatabaseChangeLogLockTable(liquibaseProperties.getDatabaseChangeLogLockTable());
        liquibase.setDatabaseChangeLogTable(liquibaseProperties.getDatabaseChangeLogTable());
        liquibase.setDropFirst(liquibaseProperties.isDropFirst());
        liquibase.setLabels(liquibaseProperties.getLabels());
        liquibase.setChangeLogParameters(liquibaseProperties.getParameters());
        liquibase.setRollbackFile(liquibaseProperties.getRollbackFile());
        liquibase.setTestRollbackOnUpdate(liquibaseProperties.isTestRollbackOnUpdate());
        if (env.acceptsProfiles(Profiles.of(JHipsterConstants.SPRING_PROFILE_NO_LIQUIBASE))) {
            liquibase.setShouldRun(false);
            log.info("Liquibase is disabled");
        }
        else {
            liquibase.setShouldRun(liquibaseProperties.isEnabled());
            log.info("Liquibase is enabled");
        }
        return liquibase;
    }
}
