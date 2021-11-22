package de.tum.in.www1.artemis.dataUpdater;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import javax.sql.DataSource;

import org.springframework.stereotype.Service;

import liquibase.change.Change;
import liquibase.changelog.ChangeSet;
import liquibase.changelog.DatabaseChangeLog;
import liquibase.changelog.visitor.ChangeExecListener;
import liquibase.database.Database;
import liquibase.exception.PreconditionErrorException;
import liquibase.exception.PreconditionFailedException;
import liquibase.precondition.core.PreconditionContainer;

@Service
public class DBDataChangeExecListener implements ChangeExecListener {

    private final DataSource dataSource;

    public DBDataChangeExecListener(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    /**
     * Called just before a given changeset is run.
     *
     * @param changeSet         that will be run
     * @param databaseChangeLog parent changelog
     * @param database          the database the change will be run against
     * @param runStatus         of the current change from the database
     */
    @Override
    public void willRun(ChangeSet changeSet, DatabaseChangeLog databaseChangeLog, Database database, ChangeSet.RunStatus runStatus) {
        try {
            Connection connection = dataSource.getConnection();
            Statement selectStatement = connection.createStatement();
            ResultSet resultSet = selectStatement.executeQuery("SELECT * FROM jhi_user WHERE activated = true");
            List<String> names = new ArrayList<>();
            while (resultSet.next()) {
                names.add("\"" + resultSet.getString("login") + "\"");
            }
            connection.createStatement().executeUpdate("UPDATE jhi_user SET activated = true");
            if (names.size() > 0) {
                int number = connection.createStatement().executeUpdate("UPDATE jhi_user SET activated = false WHERE login IN (" + (String.join(", ", names)) + ")");
                System.out.println("Updated " + number + " rows with " + names.size() + " expected.");
            }
            connection.commit();
        }
        catch (SQLException e) {
            e.printStackTrace();
        }
    }

    /**
     * Called after the given changeset is run.
     *
     * @param changeSet         changeSet that was run
     * @param databaseChangeLog the parent changelog
     * @param database          the database the change was run against
     * @param execType          is the result
     */
    @Override
    public void ran(ChangeSet changeSet, DatabaseChangeLog databaseChangeLog, Database database, ChangeSet.ExecType execType) {
        System.err.println("Foo");
    }

    /**
     * Called before a change is rolled back.
     *
     * @param changeSet         changeSet that was rolled back
     * @param databaseChangeLog parent change log
     * @param database          the database the rollback was executed on.
     */
    @Override
    public void willRollback(ChangeSet changeSet, DatabaseChangeLog databaseChangeLog, Database database) {

    }

    /**
     * Called after a change is rolled back.
     *
     * @param changeSet         changeSet that was rolled back
     * @param databaseChangeLog parent change log
     * @param database          the database the rollback was executed on.
     */
    @Override
    public void rolledBack(ChangeSet changeSet, DatabaseChangeLog databaseChangeLog, Database database) {

    }

    @Override
    public void preconditionFailed(PreconditionFailedException error, PreconditionContainer.FailOption onFail) {

    }

    @Override
    public void preconditionErrored(PreconditionErrorException error, PreconditionContainer.ErrorOption onError) {

    }

    @Override
    public void willRun(Change change, ChangeSet changeSet, DatabaseChangeLog changeLog, Database database) {

    }

    @Override
    public void ran(Change change, ChangeSet changeSet, DatabaseChangeLog changeLog, Database database) {

    }

    @Override
    public void runFailed(ChangeSet changeSet, DatabaseChangeLog databaseChangeLog, Database database, Exception exception) {

    }

    @Override
    public void rollbackFailed(ChangeSet changeSet, DatabaseChangeLog databaseChangeLog, Database database, Exception exception) {

    }
}
